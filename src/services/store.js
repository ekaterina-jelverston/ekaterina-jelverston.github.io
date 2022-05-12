const firebaseAdmin = require('firebase-admin')
const { initializeApp } = require('firebase-admin/app')
const { getFirestore } = require('firebase-admin/firestore')

class Store {
  static collectionName = 'works'

  constructor(credentialJSON) {
    initializeApp({
      credential: firebaseAdmin.credential.cert(credentialJSON)
    })
  }

  getDB() {
    return getFirestore()
  }

  async saveData(data) {
    const db = this.getDB()
    const batch = db.batch()
    const collection = db.collection(Store.collectionName)

    for (const dataItem of data) {
      const doc = collection.doc(dataItem.id)
      batch.set(doc, dataItem, {
        merge: true
      })
    }

    await batch.commit()
  }

  async getData() {
    const db = this.getDB()
    const collection = db.collection(Store.collectionName)
    const snapshot = await collection.get()
    return snapshot.docs.map(doc => doc.data())
  }
}

module.exports = {
  Store
}