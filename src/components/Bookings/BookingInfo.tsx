import { useEffect, useState } from 'react'
import { User, WorkingPlace, Booking } from '@/api-lib/types'
import { isUserAbsentToday, isUserInHomeOffice } from '@/lib/dayBooking/utils' // Adjust the import path as needed
import styles from './Booking.module.css'
import clsx from 'clsx'
import { LoadingDots } from '../LoadingDots'

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
  const [usersInHomeOffice, setUsersInHomeOffice] = useState<User[]>()
  const [availablePlaces, setAvailablePlaces] = useState<WorkingPlace[]>()

  useEffect(() => {
    usersData &&
      usersData.users?.length > 0 &&
      setAbsentUsers(
        usersData?.users.filter((user: User) => isUserAbsentToday(user))
      )
  }, [usersData])

  useEffect(() => {
    usersData &&
      usersData.users?.length > 0 &&
      setUsersInHomeOffice(
        usersData?.users.filter((user: User) => isUserInHomeOffice(user))
      )
  }, [usersData])

  useEffect(() => {
    setAvailablePlaces(
      workingPlacesData &&
        workingPlacesData.workingPlaces?.length > 0 &&
        workingPlacesData?.workingPlaces.filter(
          (place: WorkingPlace) =>
            place.isActive &&
            !todayBooking?.bookings.some(
              (booking: Booking) => booking.workingPlace === place.name
            )
        )
    )
  }, [workingPlacesData, todayBooking])

  if (!workingPlacesData || !usersData || !todayBooking) {
    return <LoadingDots />
  }

  return (
    <div className='container mx-auto p-4'>
      {!workingPlacesData || !usersData || !todayBooking ? (
        <div className='block w-full text-center'>
          <LoadingDots />
        </div>
      ) : (
        <>
          {usersData && absentUsers && absentUsers.length > 0 && (
            <div>
              <span className={clsx(styles.meta, styles.metaLabel)}>
                Heute nicht da:{' '}
              </span>
              {absentUsers?.map((u, i) => (
                <span key={u.username} className={clsx(styles.meta, 'italic')}>
                  {`${u.username}${i < absentUsers.length - 1 ? ', ' : ''}`}
                </span>
              ))}
            </div>
          )}

          {usersData && usersInHomeOffice && usersInHomeOffice.length > 0 && (
            <div>
              <span className={clsx(styles.meta, styles.metaLabel)}>
                Heute im MA:{' '}
              </span>
              {usersInHomeOffice?.map((u, i) => (
                <span key={u.username} className={clsx(styles.meta, 'italic')}>
                  {`${u.username}${
                    i < usersInHomeOffice.length - 1 ? ', ' : ''
                  }`}
                </span>
              ))}
            </div>
          )}

          {workingPlacesData && workingPlacesData.workingPlaces?.length > 0 ? (
            <div>
              <span className={clsx(styles.meta, styles.metaLabel)}>
                {availablePlaces && availablePlaces.length > 0
                  ? 'Noch verfügbare Plätze: '
                  : 'Alle Plätze sind heute ausgebucht!'}
              </span>
              {availablePlaces &&
                availablePlaces.length > 0 &&
                availablePlaces.map((place: WorkingPlace, i: number) => (
                  <span
                    key={place.name}
                    className={clsx(styles.meta, 'italic')}
                  >
                    {place.displayName}
                    {i < availablePlaces.length - 1 ? ', ' : ''}
                  </span>
                ))}
            </div>
          ) : (
            <div className={styles.meta}>
              Es wurden noch keine Arbeitsplätze angelegt
            </div>
          )}
        </>
      )}
    </div>
  )
}

export default BookingInfo
