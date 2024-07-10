import { ObjectId } from 'mongodb'

export interface Booking {
  user: string
  workingPlace: string
}

export interface DayBooking {
  _id?: ObjectId
  date: Date
  bookings: Booking[]
}
