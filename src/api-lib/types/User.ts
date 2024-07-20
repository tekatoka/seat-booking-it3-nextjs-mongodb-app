import { ObjectId } from 'mongodb'

export interface Absence {
  from: Date
  till?: Date
}

export interface User {
  _id?: ObjectId // Unique identifier for the user, typically provided by MongoDB
  username: string // User's chosen username
  email: string // User's email address
  createdAt: Date // Timestamp of when the user account was created
  password?: string
  profilePicture?: string
  absences?: Absence[]
  favouritePlaces?: string[]
  homeOfficeDays?: string[]
  isAdmin?: boolean
  color?: string
}

export interface NewUser {
  email: string
  originalPassword: string
  name: string
  username: string
  bio?: string
  profilePicture?: string
  isAdmin?: boolean
}

export type SafeUser = Omit<User, 'password'>

export interface CalendarAbsence {
  user: string
  from: string
  till?: string
  color?: string
}

export interface CalendarHomeOfficeDay {
  user: string
  date: string
  color?: string
}

export interface UserAbsencesAndHomeOfficeDays {
  absences: CalendarAbsence[]
  homeOfficeDays: CalendarHomeOfficeDay[]
}
