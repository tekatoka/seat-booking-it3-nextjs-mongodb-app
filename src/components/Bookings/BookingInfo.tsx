import { Wrapper } from '@/components/Layout'
import { useEffect, useState } from 'react'
import { User, WorkingPlace, DayBooking, Booking } from '@/api-lib/types'
import { isUserAbsentToday } from '@/lib/dayBooking/utils' // Adjust the import path as needed
import { Modal } from '@/components/Modal'

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
    <Wrapper>
      <div className='container mx-auto p-4'>
        {absentUsers && (
          <>
            Heute nicht da:{' '}
            {absentUsers?.map((u, i) => (
              <span key={u.username}>
                {`${u.username}${i < absentUsers.length - 1 ? ', ' : ''}`}
              </span>
            ))}
          </>
        )}

        <h2 className='text-xl font-bold mt-6'>Verfügbare Plätze</h2>
        <div className='list-disc list-inside'>
          {availablePlaces?.map((place: WorkingPlace) => (
            <span key={place.name}>{place.displayName}, </span>
          ))}
        </div>
      </div>
    </Wrapper>
  )
}

export default BookingInfo
