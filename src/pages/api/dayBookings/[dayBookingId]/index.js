import {
  updateDayBookingById,
  findDayBookingByDate,
  deleteDayBookingById
} from '@/api-lib/db'
import { getMongoDb } from '@/api-lib/mongodb'
import { ncOpts } from '@/api-lib/nc'
import nc from 'next-connect'
import { ValidateProps } from '@/api-lib/constants'
import { validateBody } from '@/api-lib/middlewares'

const handler = nc(ncOpts)

handler.get(async (req, res) => {
  const db = await getMongoDb()
  const { dayBookingId } = req.query
  if (dayBookingId) {
    const dayBooking = await findDayBookingByDate(db, new Date(dayBookingId))
    if (!dayBooking) {
      res.status(404).json({ error: 'Day Booking not found' })
      return
    }
    res.json({ dayBooking })
  }
})

handler.delete(async (req, res) => {
  if (!req.user) {
    return res.status(401).end()
  }

  const db = await getMongoDb()
  const { dayBookingId } = req.query

  if (!dayBookingId) {
    res.status(400).json({ error: 'Day Booking ID is required' })
    return
  }

  const result = await deleteDayBookingById(db, dayBookingId)

  if (!result) {
    res.status(404).json({ error: 'Day Booking not found' })
    return
  }

  res.status(200).json({ message: 'Day Booking deleted successfully' })
})

handler.patch(async (req, res) => {
  //handler.patch(validateBody(ValidateProps.dayBooking), async (req, res) => {
  const db = await getMongoDb()
  const { dayBookingId } = req.query

  if (!dayBookingId) {
    res.status(400).json({ error: 'Day Booking ID is required' })
    return
  }

  const updateData = {
    bookings: req.body.bookings
  }

  const dayBooking = await updateDayBookingById(db, dayBookingId, updateData)

  if (!dayBooking) {
    res.status(404).json({ error: 'Day Booking not found' })
    return
  }

  res.json({ dayBooking })
})

export default handler
