import fs from 'fs'

interface QueueItem<T> {
  requestFunc: () => Promise<T>
  resolve: (value: T) => void
  reject: (err: unknown) => void
}

interface NodeError extends Error {
  code?: string
}

const LOCK_UNLINK_RETRY_CODES = new Set(['EACCES', 'EBUSY', 'EPERM'])
const LOCK_UNLINK_MAX_ATTEMPTS = 5
const LOCK_UNLINK_RETRY_DELAY_MS = 50

export class RateLimiter {
  private queue: QueueItem<unknown>[] = []
  private inflight = new Set<string>()
  private isProcessing = false
  private lastRequestTime = 0
  private requestCount = 0
  private windowStart = Date.now()

  constructor(
    private maxRequestsPerMinute = 200,
    private lockFilePath?: string,
    private minIntervalMs = 300
  ) { }

  private async acquireLock() {
    if (!this.lockFilePath) return
    // 如果锁文件存在且创建时间过久（比如 >5分钟），认为是陈旧锁，直接删除
    if (fs.existsSync(this.lockFilePath)) {
      const stats = fs.statSync(this.lockFilePath)
      const age = Date.now() - stats.ctimeMs
      if (age > 30 * 1000) { // 30秒
        const removed = await this.unlinkLockWithRetry('删除陈旧锁失败')
        if (removed) {
          console.warn('[限流] 删除陈旧锁文件:', this.lockFilePath)
        }
      }
    }
    while (true) {
      try {
        fs.writeFileSync(this.lockFilePath, process.pid.toString(), { flag: 'wx' })
        return
      } catch (err) {
        const e = err as NodeError
        if (e.code === 'EEXIST') await new Promise(res => setTimeout(res, 100))
        else throw err
      }
    }
  }

  private async unlinkLockWithRetry(errorLabel: string) {
    if (!this.lockFilePath) return true

    for (let attempt = 1; attempt <= LOCK_UNLINK_MAX_ATTEMPTS; attempt++) {
      try {
        fs.unlinkSync(this.lockFilePath)
        return true
      } catch (err) {
        const error = err as NodeError
        if (error.code === 'ENOENT') return true

        const shouldRetry =
          error.code &&
          LOCK_UNLINK_RETRY_CODES.has(error.code) &&
          attempt < LOCK_UNLINK_MAX_ATTEMPTS
        if (!shouldRetry) {
          console.error(errorLabel, err)
          return false
        }

        await new Promise(resolve =>
          setTimeout(resolve, LOCK_UNLINK_RETRY_DELAY_MS * attempt)
        )
      }
    }

    return false
  }

  private async releaseLock() {
    await this.unlinkLockWithRetry('释放锁失败')
  }

  public enqueue<T>(key: string, requestFunc: () => Promise<T>): Promise<T> {
    if (this.inflight.has(key)) {
      return new Promise<T>((resolve, reject) => {
        const interval = setInterval(() => {
          if (!this.inflight.has(key)) {
            clearInterval(interval)
            // 用 void 显式标记忽略：递归 enqueue 自身已串接 resolve/reject
            void this.enqueue(key, requestFunc).then(resolve).catch(reject)
          }
        }, 50)
      })
    }

    return new Promise<T>((resolve, reject) => {
      this.queue.push({
        requestFunc: requestFunc as () => Promise<unknown>,
        resolve: resolve as (value: unknown) => void,
        reject
      })
      if (!this.isProcessing) {
        // processQueue 是 async 但这里不 await，需要兜底捕获
        void this.processQueue()
      }
    })
  }

  private async processQueue() {
    if (this.queue.length === 0) { this.isProcessing = false; return }
    this.isProcessing = true

    try {
      await this.acquireLock()
      const now = Date.now()
      const elapsed = now - this.windowStart

      if (elapsed > 60_000) { this.requestCount = 0; this.windowStart = now }
      if (this.requestCount >= this.maxRequestsPerMinute) {
        const waitTime = 60_000 - elapsed + 100
        await new Promise(res => setTimeout(res, waitTime))
        this.requestCount = 0
        this.windowStart = Date.now()
      }

      const waitTime = Math.max(
        0,
        this.minIntervalMs - (now - this.lastRequestTime)
      )
      if (waitTime > 0) await new Promise(res => setTimeout(res, waitTime))

      const { requestFunc, resolve, reject } = this.queue.shift()!
      const key = crypto.randomUUID()
      this.inflight.add(key)

      try {
        const result: unknown = await requestFunc()
        this.lastRequestTime = Date.now()
        this.requestCount++
        resolve(result)
      } catch (err) { reject(err) }
      finally { this.inflight.delete(key) }

    } catch (err) {
      console.error('限流队列异常', err)
    } finally {
      await this.releaseLock()
      // 显式忽略下一轮的返回 Promise
      setTimeout(() => {
        void this.processQueue()
      }, 0)
    }
  }
}
