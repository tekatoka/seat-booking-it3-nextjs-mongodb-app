import { MongoClient, Db } from 'mongodb';

declare global {
  var mongoClientPromise: Promise<MongoClient> | undefined;
}

let indexesCreated = false;

async function createIndexes(client: MongoClient): Promise<MongoClient> {
  if (indexesCreated) return client;
  const db = client.db();
  await Promise.all([
    db
      .collection('tokens')
      .createIndex({ expireAt: -1 }, { expireAfterSeconds: 0 }),
    db
      .collection('posts')
      .createIndexes([{ key: { createdAt: -1 } }, { key: { creatorId: -1 } }]),
    db
      .collection('comments')
      .createIndexes([{ key: { createdAt: -1 } }, { key: { postId: -1 } }]),
    db.collection('users').createIndexes([
      { key: { email: 1 }, unique: true },
      { key: { username: 1 }, unique: true },
    ]),
  ]);
  indexesCreated = true;
  return client;
}

export async function getMongoClient(): Promise<MongoClient> {
  if (!global.mongoClientPromise) {
    const client = new MongoClient(process.env.MONGODB_URI || '');
    global.mongoClientPromise = client.connect().then(createIndexes);
  }
  return global.mongoClientPromise;
}

export async function getMongoDb(): Promise<Db> {
  const mongoClient = await getMongoClient();
  return mongoClient.db();
}
