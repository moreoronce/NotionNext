import fs from 'fs'
import os from 'os'
import path from 'path'
import { finalizeStaticExport } from '@/scripts/finalize-static-export'

describe('finalizeStaticExport', () => {
  it('copies generated llms and sitemap files into the static output', () => {
    const projectDir = fs.mkdtempSync(
      path.join(os.tmpdir(), 'notion-next-static-export-')
    )
    const publicDir = path.join(projectDir, 'public')
    const outDir = path.join(projectDir, 'out')

    try {
      fs.mkdirSync(publicDir, { recursive: true })
      fs.mkdirSync(outDir, { recursive: true })
      fs.writeFileSync(path.join(publicDir, 'llms.txt'), '# Test site\n')
      fs.writeFileSync(path.join(publicDir, 'sitemap.xml'), '<sitemapindex />')
      fs.writeFileSync(path.join(publicDir, 'sitemap-0.xml'), '<urlset />')

      const copied = finalizeStaticExport({ publicDir, outDir })

      expect(copied).toEqual(['llms.txt', 'sitemap-0.xml', 'sitemap.xml'])
      expect(fs.readFileSync(path.join(outDir, 'llms.txt'), 'utf8')).toBe(
        '# Test site\n'
      )
      expect(fs.existsSync(path.join(outDir, 'sitemap.xml'))).toBe(true)
      expect(fs.existsSync(path.join(outDir, 'sitemap-0.xml'))).toBe(true)
    } finally {
      fs.rmSync(projectDir, { recursive: true, force: true })
    }
  })

  it('fails the export when a required static artifact is missing', () => {
    const projectDir = fs.mkdtempSync(
      path.join(os.tmpdir(), 'notion-next-static-export-')
    )
    const publicDir = path.join(projectDir, 'public')
    const outDir = path.join(projectDir, 'out')

    try {
      fs.mkdirSync(publicDir, { recursive: true })
      fs.writeFileSync(path.join(publicDir, 'sitemap.xml'), '<urlset />')

      expect(() => finalizeStaticExport({ publicDir, outDir })).toThrow(
        'Missing required static export artifact: llms.txt'
      )
    } finally {
      fs.rmSync(projectDir, { recursive: true, force: true })
    }
  })
})
