import { ObjectId } from 'mongodb';
import { User } from './User';

export interface Post {
  _id?: ObjectId;
  content: string;
  creatorId: ObjectId;
  createdAt: Date;
  creator?: User;
}
