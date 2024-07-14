import Image from 'next/image'
import { WorkingPlace, Booking } from '@/api-lib/types'
import styles from './Booking.module.css'
import { useState } from 'react'
import BookingCard from './BookingCard'

interface BookingListProps {
  todayBooking: any
  workingPlacesData: any
}

const BookingList: React.FC<BookingListProps> = ({
  todayBooking,
  workingPlacesData
}) => {
  return (
    <div className='container mx-auto p-4'>
      <div className='grid grid-cols-1 lg:grid-cols-4 gap-4'>
        {todayBooking &&
          todayBooking.bookings.map((booking: Booking) => {
            const place = workingPlacesData?.workingPlaces.find(
              (place: WorkingPlace) => place.name === booking.workingPlace
            )
            return place ? (
              <BookingCard key={booking.user} booking={booking} place={place} />
            ) : null
          })}
      </div>
    </div>
  )
}

export default BookingList
