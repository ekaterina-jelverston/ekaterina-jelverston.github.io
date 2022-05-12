const URLFilter = require('@11ty/eleventy/src/Filters/Url')
const { CONFIG } = require('../config')

function prefixURL(url) {
  return URLFilter(url, CONFIG.PATH_PREFIX)
}

module.exports = {
  permalink: false,

  eleventyComputed: {
    baseMediaURL: (data) => {
      const { id } = data
      return '/media/' + id
    },

    mediaURL: (data) => {
      const { baseMediaURL, media_url } = data
      return baseMediaURL + '/' + media_url
    },

    srcSet: (data) => {
      const { baseMediaURL, srcSet } = data

      if (!srcSet) {
        return null
      }

      return Object.entries(srcSet)
        .map(([size, fileName]) => prefixURL(baseMediaURL + '/' + fileName) + ` ` + `${size}w`)
        .join(',')
    }
  }
}