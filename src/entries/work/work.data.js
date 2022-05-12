module.exports = {
  pagination: {
    data: 'collections.works',
    size: 1,
    alias: 'work'
  },

  eleventyComputed: {
    permalink: (data) => {
      const { work } = data
      return '/works/' + work?.data?.id + '/'
    }
  }
}