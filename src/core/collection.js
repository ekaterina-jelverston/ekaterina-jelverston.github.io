class Collection extends Array {
  mapByFileSlug = {}
  mapByFilePathStem = {}
  mapByInputPath = {}

  constructor({ items }) {
    super()

    if (items && items.length > 0) {
      for (const item of items) {
        this.push(item)
        this.mapByFileSlug[item.fileSlug] = item
        this.mapByFilePathStem[item.filePathStem] = item
        this.mapByInputPath[item.inputPath] = item
      }
    }
  }
}

module.exports = {
  Collection
}