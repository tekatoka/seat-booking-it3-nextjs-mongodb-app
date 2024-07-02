import { Db, ObjectId } from 'mongodb';
import { nanoid } from 'nanoid';

interface CreateTokenParams {
  creatorId: ObjectId; // or string, depending on your implementation
  type: string;
  expireAt: Date;
}

export function findTokenByIdAndType(db: Db, id: string, type: any) {
  return db.collection('tokens').findOne({
    _id: id,
    type,
  });
}

export function findAndDeleteTokenByIdAndType(db: Db, id: string, type: any) {
  return db
    .collection('tokens')
    .findOneAndDelete({ _id: id, type })
    .then(({ value }) => value);
}

export async function createToken(
  db: Db,
  { creatorId, type, expireAt }: CreateTokenParams
) {
  const token = {
    creatorId,
    type,
    expireAt,
    createdAt: new Date(),
  };

  const result = await db.collection('tokens').insertOne(token);
  return result.insertedId;
}
