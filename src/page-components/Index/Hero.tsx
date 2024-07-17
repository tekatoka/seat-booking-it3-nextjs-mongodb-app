import { Wrapper } from '@/components/Layout'
import { Suspense, useEffect, useState } from 'react'
import { DayBooking } from '@/api-lib/types'
import { useCurrentUser, useUsers } from '@/lib/user'
import { useWorkingPlaces } from '@/lib/workingPlace'
import { useDayBooking, useDayBookings } from '@/lib/dayBooking'
import { useRouter } from 'next/router'
import {
  BookingInfo,
  BookingList,
  BookingSelection
} from '@/components/Bookings'
import { LoadingDots } from '@/components/LoadingDots'

const Hero: React.FC = () => {
  const today = new Date().toISOString().split('T')[0] // Format the date string

  const [todayBooking, setTodayBooking] = useState<DayBooking>({
    bookings: [],
    date: new Date()
  })

  const { data: usersData, error: usersError } = useUsers()
  const { data: workingPlacesData, error: workingPlacesError } =
    useWorkingPlaces()

  const { data: dataCurrentUser, error: errorCurrentUser } = useCurrentUser()

  const loadingCurrentUser = !dataCurrentUser && !errorCurrentUser

  const {
    data: daybookingData,
    error: daybookingError,
    mutate: dayBookingMutate
  } = useDayBooking(today)
  const router = useRouter()

  useEffect(() => {
    if (!usersData && !usersError) return
    if (!workingPlacesData && !workingPlacesError) return
    if (!daybookingData && !daybookingError) return
  }, [
    router,
    usersData,
    workingPlacesData,
    daybookingData,
    usersError,
    workingPlacesError,
    daybookingError
  ])

  if (loadingCurrentUser && !errorCurrentUser) return <LoadingDots />

  return (
    <Wrapper>
      {}
      <div className='container mx-auto p-4'>
        <Suspense fallback={<LoadingDots />}>
          <BookingSelection
            usersData={usersData}
            todayBooking={todayBooking}
            workingPlacesData={workingPlacesData}
            daybookingData={daybookingData}
            setTodayBooking={setTodayBooking}
            dayBookingMutate={dayBookingMutate}
            dataCurrentUser={dataCurrentUser}
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
        </Suspense>
      </div>
    </Wrapper>
  )
}

export default Hero
