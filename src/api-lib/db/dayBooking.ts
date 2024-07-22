import { Db, ObjectId } from 'mongodb'
import { DayBooking } from '../types/DayBooking'

// Finds all day bookings
export async function findAllDayBookings(db: Db): Promise<DayBooking[]> {
  return db.collection<DayBooking>('dayBookings').find().toArray()
}

// Finds a day booking by date
export async function findDayBookingByDate(
  db: Db,
  date: Date
): Promise<DayBooking | null> {
  const localDate = new Date(date)
  const startOfDay = new Date(
    Date.UTC(
      localDate.getFullYear(),
      localDate.getMonth(),
      localDate.getDate(),
      0,
      0,
      0
    )
  )
  const endOfDay = new Date(
    Date.UTC(
      localDate.getFullYear(),
      localDate.getMonth(),
      localDate.getDate(),
      23,
      59,
      59,
      999
    )
  )

  return db.collection<DayBooking>('dayBookings').findOne({
    date: {
      $gte: startOfDay,
      $lt: endOfDay
    }
  })
}

// Adds a new day booking
export async function addDayBooking(
  db: Db,
  newDayBooking: Omit<DayBooking, '_id'>
): Promise<DayBooking> {
  const dayBooking: DayBooking = {
    ...newDayBooking,
    date: newDayBooking.date // ensure date is a Date object
  }

  const { insertedId } = await db
    .collection<DayBooking>('dayBookings')
    .insertOne(dayBooking)
  return { ...dayBooking, _id: insertedId }
}

// Updates a day booking by ID
export async function updateDayBookingById(
  db: Db,
  id: string,
  data: Partial<DayBooking>
): Promise<DayBooking | null> {
  return db
    .collection<DayBooking>('dayBookings')
    .findOneAndUpdate(
      { _id: new ObjectId(id) },
      { $set: data },
      { returnDocument: 'after' }
    )
    .then(result => result.value || null)
}

// Deletes a day booking by ID
export async function deleteDayBookingById(
  db: Db,
  id: string
): Promise<boolean> {
  const result = await db
    .collection('dayBookings')
    .deleteOne({ _id: new ObjectId(id) })
  return result.deletedCount === 1
}
