import fs from 'fs'
import os from 'os'
import path from 'path'
import { RateLimiter } from '@/lib/db/notion/RateLimiter'

describe('Notion build RateLimiter', () => {
  it('retries transient Windows errors while releasing its lock file', async () => {
    const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'notion-rate-lock-'))
    const lockPath = path.join(tempDir, '.notion-api-lock')
    const realUnlinkSync = fs.unlinkSync.bind(fs)
    const randomUUID = globalThis.crypto.randomUUID
    let lockUnlinkAttempts = 0

    Object.defineProperty(globalThis.crypto, 'randomUUID', {
      configurable: true,
      value: () => '00000000-0000-4000-8000-000000000000'
    })

    jest.spyOn(fs, 'unlinkSync').mockImplementation(filePath => {
      if (filePath === lockPath && lockUnlinkAttempts++ < 2) {
        const error = new Error('file is temporarily busy')
        error.code = 'EPERM'
        throw error
      }
      return realUnlinkSync(filePath)
    })

    try {
      const limiter = new RateLimiter(200, lockPath, 0)

      await expect(limiter.enqueue('page', async () => 'ok')).resolves.toBe(
        'ok'
      )
      await new Promise(resolve => setTimeout(resolve, 250))
      expect(lockUnlinkAttempts).toBe(3)
      expect(fs.existsSync(lockPath)).toBe(false)
    } finally {
      Object.defineProperty(globalThis.crypto, 'randomUUID', {
        configurable: true,
        value: randomUUID
      })
      fs.rmSync(tempDir, { recursive: true, force: true })
    }
  })
})
