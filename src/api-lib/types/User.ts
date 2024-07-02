import { ObjectId } from 'mongodb';

export interface User {
  _id?: ObjectId; // Unique identifier for the user, typically provided by MongoDB
  username: string; // User's chosen username
  email: string; // User's email address
  createdAt: Date; // Timestamp of when the user account was created
  password?: string;
  name: string;
  bio: string;
  emailVerified: boolean;
  profilePicture?: string;
}

export interface NewUser {
  email: string;
  originalPassword: string;
  name: string;
  username: string;
  bio?: string;
  profilePicture?: string;
}
