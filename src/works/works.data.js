module.exports = {
  permalink: false,

  eleventyComputed: {
    date: (data) => {
      const { timestamp } = data
      return new Date(timestamp)
    },

    publications: (data) => {
      const { collections, publications_ids } = data
      const { mediaWorks } = collections
      return publications_ids?.map((id) => mediaWorks?.mapByFileSlug?.[id])
    },

    publication: (data) => {
      const { publications } = data
      const publication = publications?.[0]
      return publication
    },

    selfURL: (data) => {
      const { id } = data
      return '/works/' + id + '/'
    },

    mediaURL: (data) => {
      const { publication } = data
      return publication?.data?.mediaURL
    },

    srcSet: (data) => {
      const { publication } = data
      return publication?.data?.srcSet
    }
  }
}