require('dotenv').config()

const CONFIG = {
  ENV: process.env.NODE_ENV || 'production',
  STORE_CREDENTIAL: JSON.parse(process.env.FIREBASE_CREDENTIAL),
  PATH_PREFIX: process.env.PATH_PREFIX ?? '/'
}

const MEDIA_TYPES = {
  IMAGE: 'IMAGE',
  VIDEO: 'VIDEO',
  CAROUSEL_ALBUM: 'CAROUSEL_ALBUM'
}

module.exports = {
  CONFIG,
  MEDIA_TYPES
}