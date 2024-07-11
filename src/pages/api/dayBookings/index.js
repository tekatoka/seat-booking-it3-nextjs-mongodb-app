import { ValidateProps } from '@/api-lib/constants'
import { findAllDayBookings, addDayBooking } from '@/api-lib/db'
// import { findAllDayBookings, addDayBooking } from '@/api-lib/db'
import { auths, validateBody } from '@/api-lib/middlewares'
import { getMongoDb } from '@/api-lib/mongodb'
import { ncOpts } from '@/api-lib/nc'
import nc from 'next-connect'

const handler = nc(ncOpts)

// Handler to get all day bookings
handler.get(async (req, res) => {
  const db = await getMongoDb()

  const dayBookings = await findAllDayBookings(db)

  res.json({ dayBookings })
})

// Handler to add a new day booking
handler.post(...auths, async (req, res) => {
  if (!req.user) {
    return res.status(401).end()
  }

  const db = await getMongoDb()

  const dayBooking = await addDayBooking(db, {
    date: new Date(req.body.date),
    bookings: req.body.bookings
  })

  return res.json({ dayBooking })
})

export default handler
