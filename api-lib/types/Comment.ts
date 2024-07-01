import { ObjectId } from 'mongodb';
import { User } from './User';

export interface Comment {
  _id?: ObjectId; // Optional because it's undefined when creating a new comment
  content: string; // The text content of the comment
  postId: ObjectId; // Reference to the post to which the comment belongs
  creatorId: ObjectId; // Reference to the user who created the comment
  createdAt: Date; // Timestamp of when the comment was created
  creator?: User; // Optional embedded user data populated via lookup
}
