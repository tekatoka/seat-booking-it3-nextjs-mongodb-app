import { MongoClient } from 'mongodb'

declare global {
  namespace NodeJS {
    interface Global {
      mongoClientPromise: Promise<MongoClient> | undefined
    }
  }
}

// To prevent TypeScript from treating this file as an ES module
export {}
