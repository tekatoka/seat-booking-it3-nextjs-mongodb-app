import { ObjectId, Db } from 'mongodb'
import { dbProjectionUsers } from '.'
import { Comment } from '../types/Comment'

// Function to find comments for a specific post
export async function findComments(
  db: Db,
  postId: string,
  before: Date | null,
  limit: number = 10
): Promise<Comment[]> {
  return db
    .collection<Comment>('comments')
    .aggregate<Comment>([
      {
        $match: {
          postId: new ObjectId(postId),
          ...(before && { createdAt: { $lt: before } })
        }
      },
      { $sort: { _id: -1 } },
      { $limit: limit },
      {
        $lookup: {
          from: 'users',
          localField: 'creatorId',
          foreignField: '_id',
          as: 'creator'
        }
      },
      { $unwind: '$creator' },
      { $project: dbProjectionUsers('creator.') }
    ])
    .toArray()
}

// Function to insert a new comment into the database
export async function insertComment(
  db: Db,
  postId: string,
  { content, creatorId }: { content: string; creatorId: ObjectId }
): Promise<Comment> {
  const comment: Comment = {
    content,
    postId: new ObjectId(postId),
    creatorId,
    createdAt: new Date()
  }
  const { insertedId } = await db
    .collection<Comment>('comments')
    .insertOne(comment)
  comment._id = insertedId
  return comment
}
