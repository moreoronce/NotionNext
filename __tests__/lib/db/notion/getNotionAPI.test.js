describe('getNotionAPI', () => {
  const originalEnv = process.env

  beforeEach(() => {
    jest.resetModules()
    process.env = { ...originalEnv }
    delete process.env.API_BASE_URL
  })

  afterEach(() => {
    process.env = originalEnv
  })

  it('sets the current Notion API host and User-Agent for notion-client', async () => {
    const NotionAPI = jest.fn().mockImplementation(() => ({
      getPage: jest.fn().mockResolvedValue({})
    }))
    jest.doMock('notion-client', () => ({ NotionAPI }))

    const notionAPI = require('@/lib/db/notion/getNotionAPI').default
    await notionAPI.getPage('page-id')

    expect(NotionAPI).toHaveBeenCalledWith(
      expect.objectContaining({
        // fork 默认走自建 Notion API 代理（blog.config.js 的 API_BASE_URL）
        apiBaseUrl: 'https://yawata.notion.site/api/v3',
        ofetchOptions: {
          headers: {
            'User-Agent': 'NotionNext (+https://github.com/NotionNext/NotionNext)'
          }
        }
      })
    )
  })
})
