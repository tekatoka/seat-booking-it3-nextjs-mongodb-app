import { Wrapper } from '@/components/Layout'
import { useEffect, useState } from 'react'
import { DayBooking } from '@/api-lib/types'
import { useUsers } from '@/lib/user'
import { useWorkingPlaces } from '@/lib/workingPlace'
import { useDayBooking, useDayBookings } from '@/lib/dayBooking'
import { useRouter } from 'next/router'
import {
  BookingInfo,
  BookingList,
  BookingSelection
} from '@/components/Bookings'

const Hero: React.FC = () => {
  const today = new Date().toISOString().split('T')[0] // Format the date string

  const [todayBooking, setTodayBooking] = useState<DayBooking>({
    bookings: [],
    date: new Date()
  })

  const { data: usersData, error: usersError } = useUsers()
  const { data: workingPlacesData, error: workingPlacesError } =
    useWorkingPlaces()

  const {
    data: daybookingData,
    error: daybookingError,
    mutate: dayBookingMutate
  } = useDayBooking(today)
  const router = useRouter()

  useEffect(() => {
    if (!usersData && !usersError) return
  }, [router, usersData, usersError])

  return (
    <Wrapper>
      <div className='container mx-auto p-4'>
        <BookingSelection
          usersData={usersData}
          todayBooking={todayBooking}
          workingPlacesData={workingPlacesData}
          daybookingData={daybookingData}
          setTodayBooking={setTodayBooking}
          dayBookingMutate={dayBookingMutate}
        />
        <BookingInfo
          usersData={usersData}
          todayBooking={todayBooking}
          workingPlacesData={workingPlacesData}
        />
        <BookingList
          todayBooking={todayBooking}
          workingPlacesData={workingPlacesData}
        />
      </div>
    </Wrapper>
  )
}

export default Hero
