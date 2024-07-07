import { ObjectId } from 'mongodb'

export interface WorkingPlace {
  _id?: ObjectId // Unique identifier for the user, typically provided by MongoDB
  name: string
  pcName: string
  image?: string
  createdAt: Date
}
