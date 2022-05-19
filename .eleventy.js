const { parseHTML } = require('linkedom')
const { CONFIG } = require('./src/config')
const { Collection } = require('./src/core/collection')

module.exports = (eleventyConfig) => {
  eleventyConfig.setBrowserSyncConfig({
    server: {
      baseDir: [
        './src/theme',
        './dist',
      ]
    },
    files: [
      'src/**/*.{css,js,njk}',
    ],
  })

  eleventyConfig.addPassthroughCopy({ 'src/public/': '/' })
  eleventyConfig.addPassthroughCopy('src/media/**/*.{jpg,jpeg,png,mp4}')

  eleventyConfig.addGlobalData('ENV', CONFIG.ENV)
  eleventyConfig.addGlobalData('manifest', (() => {
    try {
      return require('./dist/manifest.json')
    } catch {
      return {}
    }
  })())

  eleventyConfig.addCollection('works', (collectionAPI) => {
    const items = collectionAPI.getFilteredByGlob('src/works/*/index.md')
      .sort((a, b) => new Date(b.data.date) - new Date(a.data.date))

    return new Collection({
      items
    })
  })

  eleventyConfig.addCollection('mediaWorks', (collectionAPI) => {
    return new Collection({
      items: collectionAPI.getFilteredByGlob('src/media/*/index.md')
    })
  })

  eleventyConfig.addFilter('log', (value, label = 'log') => {
    console.log(label, ':', value)
  })

  eleventyConfig.addTransform('tag-label-transform', function (content) {
    const context = this

    if (!context.outputPath) {
      return content
    }

    if (!context.outputPath.endsWith('.html')) {
      return content
    }

    const window = parseHTML(content)
    const descriptnioElement = window.document.querySelector('.work-detail-card__text')

    if (!descriptnioElement) {
      return content
    }

    const SPACE_SYMBOL = ' '
    const WRAP_SYMBOL = '\n'
    const transformedContent = descriptnioElement.textContent
      .split(WRAP_SYMBOL)
      .filter(Boolean)
      .map((paragraph) =>
        paragraph.split(SPACE_SYMBOL)
          .map((word) =>
            word.startsWith('#')
              ? `<span class="tag">${word}</span>`
              : word
          )
          .join(SPACE_SYMBOL)
      )
      .map((paragraph) => `<p>${paragraph}</p>`)
      .join('')

    descriptnioElement.innerHTML = transformedContent

    return window.document.toString()
  })

  return {
    dir: {
      input: 'src',
      output: 'dist',
      data: 'global-data',
      includes: 'theme',
    },
    jsDataFileSuffix: '.data',
    pathPrefix: CONFIG.PATH_PREFIX,
  }
}