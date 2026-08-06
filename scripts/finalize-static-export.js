const fs = require('fs')
const path = require('path')

const SITEMAP_FILE_PATTERN = /^sitemap(?:-\d+)?\.xml$/

function finalizeStaticExport({
  publicDir = path.resolve(process.cwd(), 'public'),
  outDir = path.resolve(process.cwd(), 'out')
} = {}) {
  const publicFiles = fs.existsSync(publicDir) ? fs.readdirSync(publicDir) : []
  const artifactNames = publicFiles
    .filter(name => name === 'llms.txt' || SITEMAP_FILE_PATTERN.test(name))
    .sort()

  for (const requiredName of ['llms.txt', 'sitemap.xml']) {
    if (!artifactNames.includes(requiredName)) {
      throw new Error(
        `Missing required static export artifact: ${requiredName}`
      )
    }
  }

  fs.mkdirSync(outDir, { recursive: true })
  for (const artifactName of artifactNames) {
    fs.copyFileSync(
      path.join(publicDir, artifactName),
      path.join(outDir, artifactName)
    )
  }

  return artifactNames
}

if (require.main === module) {
  const copied = finalizeStaticExport()
  console.log(`[static-export] copied ${copied.join(', ')} to out/`)
}

module.exports = { finalizeStaticExport }
