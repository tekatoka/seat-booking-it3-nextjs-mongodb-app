import { useEffect, useState } from 'react'
import { User, WorkingPlace, Booking } from '@/api-lib/types'
import { isUserAbsentToday } from '@/lib/dayBooking/utils' // Adjust the import path as needed
import styles from './Booking.module.css'
import clsx from 'clsx'

interface BookingInfoProps {
  usersData: any
  todayBooking: any
  workingPlacesData: any
}

const BookingInfo: React.FC<BookingInfoProps> = ({
  usersData,
  todayBooking,
  workingPlacesData
}) => {
  const [absentUsers, setAbsentUsers] = useState<User[]>()
  const [availablePlaces, setAvailablePlaces] = useState<WorkingPlace[]>()

  useEffect(() => {
    setAbsentUsers(
      usersData?.users.filter((user: User) => isUserAbsentToday(user))
    )
  }, [usersData])

  useEffect(() => {
    setAvailablePlaces(
      workingPlacesData?.workingPlaces.filter(
        (place: WorkingPlace) =>
          !todayBooking?.bookings.some(
            (booking: Booking) => booking.workingPlace === place.name
          )
      )
    )
  }, [workingPlacesData, todayBooking])

  return (
    <div className='container mx-auto p-4'>
      {absentUsers && absentUsers.length > 0 && (
        <>
          <span className={styles.meta}>Heute nicht da: </span>
          {absentUsers?.map((u, i) => (
            <span key={u.username} className={clsx(styles.meta, 'italic')}>
              {`${u.username}${i < absentUsers.length - 1 ? ', ' : ''}`}
            </span>
          ))}
        </>
      )}

      <div>
        <span className={styles.meta}>
          {availablePlaces && availablePlaces.length > 0
            ? 'Noch verfügbare Plätze: '
            : 'Alle Plätze sind heute ausgebucht!'}
        </span>
        {availablePlaces &&
          availablePlaces.length > 0 &&
          availablePlaces.map((place: WorkingPlace, i: number) => (
            <span key={place.name} className={clsx(styles.meta, 'italic')}>
              {place.displayName}
              {i < availablePlaces.length - 1 ? ', ' : ''}
            </span>
          ))}
      </div>
    </div>
  )
}

export default BookingInfo
