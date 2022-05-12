const fs = require('node:fs')
const fsp = require('node:fs/promises')
const path = require('node:path')
const { once } = require('node:events')
const https = require('node:https')
const { pipeline } = require('node:stream/promises')
const sharp = require('sharp')
const { CONFIG, MEDIA_TYPES } = require('../config')
const { Store } = require('../services/store')

async function saveStreamToFile(stream, destinationPath) {
  return pipeline(
    stream,
    fs.createWriteStream(destinationPath)
  )
}

function parseFileName(mediaUrl) {
  const fileURL = new URL(mediaUrl)
  const baseFileName = path.basename(fileURL.pathname)
  const extName = path.extname(baseFileName)

  return {
    baseFileName,
    extName,
  }
}

async function job(work, directory) {
  const { baseFileName, extName } = parseFileName(work.media_url)
  const fullFileName = baseFileName + extName

  const [response] = await once(https.get(work.media_url), 'response')

  work.media_url = fullFileName

  if (work.media_type === MEDIA_TYPES.VIDEO) {
    return saveStreamToFile(
      response,
      destinationFilePath = path.join(directory, fullFileName)
    )
  } else {
    return imageJob(work, response, directory, baseFileName, extName)
  }
}

async function imageJob(work, imageStream, directory, baseFileName, extName) {
  const imageTransformStream = sharp()

  pipeline(imageStream, imageTransformStream)
    .catch((error) => console.log('Ошибка преобразования изображения: ', error))

  const imageMetaData = await imageTransformStream.clone().metadata()
  const originalWidth = imageMetaData.width
  work.srcSet = {}
  let size = 320
  const sizeStep = 160
  while (size < originalWidth) {
    work.srcSet[size] = baseFileName + `.w${size}` + extName
    size += sizeStep
  }

  const promises = []
  for (const [size, fileName] of Object.entries(work.srcSet)) {
    promises.push(
      saveStreamToFile(
        imageTransformStream.clone().resize(parseFloat(size)),
        path.join(directory, fileName)
      )
    )
  }

  promises.push(
    saveStreamToFile(
      imageTransformStream.clone(),
      path.join(directory, baseFileName + extName)
    )
  )

  work.srcSet[originalWidth] = baseFileName + extName

  return Promise.all(promises)
}

;(async () => {
  const store = new Store(CONFIG.STORE_CREDENTIAL)
  const works = await store.getData()

  for (const work of works) {
    const items = [work]
    if (work.children) {
      for (const child of work.children) {
        items.push(child)
      }
    }

    for (const work of items) {
      work.origin_link = work.permalink
      delete work.permalink
    }
  }

  for (const work of works) {
    work.children = work.children
      ? work.children
      : [{
        id: work.id,
        media_type: work.media_type,
        media_url: work.media_url,
      }]
  }

  const publications = works.map((work) => {
    const {
      children,
      media_url,
      thumbnail_url,
      username,
      ...restFields
    } = work
    return {
      ...restFields,
      publications_ids: children.map((child) => child.id)
    }
  })

  const mediaItemsMap = works
    .flatMap((work) => work.children)
    .reduce((acc, item) => {
      acc[item.id] = item
      return acc
    }, {})

  const rootDir = process.cwd()
  const worksDirectory = path.join(rootDir, 'src', 'works')
  const mediaDirectory = path.join(rootDir, 'src', 'media')

  for (const publication of publications) {
    const publicationDirectory = path.join(worksDirectory, publication.id)

    await fsp.mkdir(publicationDirectory, { recursive: true })

    await fsp.writeFile(
      path.join(publicationDirectory, 'index.md'),
      ['---json', JSON.stringify(publication, null, 2), '---'].join('\n')
    )
  }

  for (const mediaWork of Object.values(mediaItemsMap)) {
    const mediaWorkDirectory = path.join(mediaDirectory, mediaWork.id)

    try {
      await fsp.stat(mediaWorkDirectory)
      continue
    } catch {
      await fsp.mkdir(mediaWorkDirectory, { recursive: true })
      await job(mediaWork, mediaWorkDirectory)
      await fsp.writeFile(
        path.join(mediaWorkDirectory, 'index.md'),
        ['---json', JSON.stringify(mediaWork, null, 2), '---'].join('\n')
      )
    }
  }
})()