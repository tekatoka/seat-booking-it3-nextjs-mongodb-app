// Assuming dbProjectionUsers correctly handles the projection for 'creator'
import { Db, ObjectId } from 'mongodb';
import { Post } from '../types';
import { dbProjectionUsers } from './user';

export async function findPostById(db: Db, id: string): Promise<Post | null> {
  const posts = await db
    .collection('posts')
    .aggregate([
      { $match: { _id: new ObjectId(id) } },
      { $limit: 1 },
      {
        $lookup: {
          from: 'users',
          localField: 'creatorId',
          foreignField: '_id',
          as: 'creator',
        },
      },
      { $unwind: '$creator' },
      { $project: dbProjectionUsers('creator.') },
    ])
    .toArray();
  return posts[0] ? (posts[0] as Post) : null;
}

export async function findPosts(
  db: Db,
  before: Date | null,
  by: string | null,
  limit: number = 10
): Promise<Post[]> {
  return db
    .collection('posts')
    .aggregate([
      {
        $match: {
          ...(by && { creatorId: new ObjectId(by) }),
          ...(before && { createdAt: { $lt: before } }),
        },
      },
      { $sort: { _id: -1 } },
      { $limit: limit },
      {
        $lookup: {
          from: 'users',
          localField: 'creatorId',
          foreignField: '_id',
          as: 'creator',
        },
      },
      { $unwind: '$creator' },
      { $project: dbProjectionUsers('creator.') },
    ])
    .toArray() as Promise<Post[]>;
}

export async function insertPost(
  db: Db,
  { content, creatorId }: { content: string; creatorId: string }
): Promise<Post> {
  const post = {
    content,
    creatorId: new ObjectId(creatorId),
    createdAt: new Date(),
  };
  const { insertedId } = await db.collection('posts').insertOne(post);
  return {
    ...post,
    _id: insertedId,
  } as Post;
}
