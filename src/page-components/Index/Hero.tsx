import { Button } from '@/components/Button'
import { Wrapper } from '@/components/Layout'
import { FormEvent, useCallback, useEffect, useState } from 'react'
import { DropdownSelect, Option } from '@/components/DropdownSelect'
import { Modal } from '@/components/Modal'
import { User, WorkingPlace, DayBooking, Booking } from '@/api-lib/types'
import { useUsers } from '@/lib/user'
import { useWorkingPlaces } from '@/lib/workingPlace'
import { useDayBooking, useDayBookings } from '@/lib/dayBooking'
import { useRouter } from 'next/router'
import toast from 'react-hot-toast'
import { fetcher } from '@/lib/fetch'
import {
  getUserByUsername,
  getRandomPlace,
  isUserAbsentToday,
  getUsersNotAbsentAndNoBooking,
  getNewBooking,
  formatDate
} from '@/lib/dayBooking/utils' // Adjust the import path as needed

const Hero: React.FC = () => {
  const [absentUsers, setAbsentUsers] = useState<User[]>()
  const [availableUsers, setAvailableUsers] = useState<User[]>()
  const [selectedUser, setSelectedUser] = useState<string | undefined>()
  const [availableUserOptions, setAvailableUserOptions] = useState<Option[]>([])
  const [todayBooking, setTodayBooking] = useState<DayBooking>({
    bookings: [],
    date: new Date()
  })
  const [isLoading, setIsLoading] = useState(false)

  const { data: usersData, error: usersError } = useUsers()
  const { data: workingPlacesData, error: workingPlacesError } =
    useWorkingPlaces()
  const { data: daybookingsData, error: daybookingsError } = useDayBookings()

  const today = new Date().toISOString().split('T')[0] // Format the date string
  const {
    data: daybookingData,
    error: daybookingError,
    mutate: dayBookingMutate
  } = useDayBooking(today)
  const router = useRouter()

  useEffect(() => {
    if (!usersData && !usersError) return
  }, [router, usersData, usersError])

  const createDayBooking = (date: Date): Promise<DayBooking> => {
    return Promise.resolve({ date, bookings: [] })
  }

  const updateDayBooking = async (dayBooking: DayBooking): Promise<void> => {
    console.log('Updating day booking:', dayBooking)
    await new Promise(resolve => setTimeout(resolve, 100)) // Simulate a delay
    // TODO: Update in the database
  }

  useEffect(() => {
    const getAvailableUsers = async () => {
      const today = new Date()
      today.setHours(0, 0, 0, 0) // Normalize to midnight

      const dayBooking = daybookingData?.dayBooking
      if (dayBooking) {
        const availableUsers = await getUsersNotAbsentAndNoBooking(dayBooking, {
          users: usersData?.users
        })
        setAvailableUsers(availableUsers)
        setTodayBooking(dayBooking)
      } else {
        const newDayBooking = await createDayBooking(today)
        setTodayBooking(newDayBooking)
        const availableUsers = await getUsersNotAbsentAndNoBooking(
          newDayBooking,
          { users: usersData?.users }
        )
        setAvailableUsers(availableUsers)
      }
      setAbsentUsers(
        usersData?.users.filter((user: User) =>
          isUserAbsentToday(user, new Date())
        )
      )
    }
    getAvailableUsers()
  }, [usersData, daybookingData])

  useEffect(() => {
    const options: Option[] =
      availableUsers?.map(user => ({
        value: user.username,
        label: user.username
      })) || []
    setAvailableUserOptions(options)
  }, [availableUsers])

  const handleChange = (option: Option | null) => {
    setSelectedUser(option?.value)
  }

  const onSubmit = useCallback(
    async (event: FormEvent<HTMLFormElement>) => {
      setIsLoading(true)
      event.preventDefault()
      try {
        if (selectedUser) {
          const newBooking = await getNewBooking(
            selectedUser,
            todayBooking,
            { workingPlaces: workingPlacesData?.workingPlaces || [] },
            usersData
          )

          if (newBooking) {
            setTodayBooking(prevTodayBooking => {
              const updatedBookings = [...prevTodayBooking.bookings, newBooking]
              const updatedTodayBooking = {
                ...prevTodayBooking,
                bookings: updatedBookings
              }

              // Send the updated todayBooking to the server
              fetch('/api/dayBookings', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  date: updatedTodayBooking.date,
                  bookings: updatedTodayBooking.bookings
                })
              })
                .then(async response => {
                  if (!response.ok) {
                    throw new Error('Failed to add booking')
                  }
                  return response.json()
                })
                .then(data => {
                  toast.success('Booking successfully added.')
                })
                .catch(error => {
                  console.error('Error adding booking:', error)
                  toast.error('Failed to add booking.')
                })
                .finally(() => {
                  setIsLoading(false)
                })
              return updatedTodayBooking
            })
          }
        }
      } catch (e) {
        toast.error('Failed to add booking.')
        setIsLoading(false)
      }
    },
    [selectedUser, todayBooking, workingPlacesData]
  )

  const availablePlaces = workingPlacesData?.workingPlaces.filter(
    (place: WorkingPlace) =>
      !todayBooking?.bookings.some(
        booking => booking.workingPlace === place.name
      )
  )

  return (
    <Wrapper>
      <div className='container mx-auto p-4'>
        {todayBooking && <>Total bookings: {todayBooking?.bookings.length}</>}
        <br />
        Heute ist der {formatDate(new Date())}
        <br />
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
        <h1 className='text-2xl font-bold mb-4'>Figur erfahren</h1>
        <form onSubmit={onSubmit}>
          <div className='flex flex-col sm:flex-row sm:space-x-4 space-y-4 sm:space-y-0'>
            <DropdownSelect
              options={availableUserOptions}
              onChange={handleChange}
              placeholder='Select a place...'
              value={
                availableUserOptions.find(
                  option => option.value === selectedUser
                ) || null
              }
            />
            <Button
              size='medium'
              variant='primary'
              type='submit'
              disabled={!selectedUser}
            >
              Los!
            </Button>
          </div>
        </form>
        {todayBooking &&
          todayBooking.bookings.map(booking => {
            const place = workingPlacesData?.workingPlaces.find(
              (place: WorkingPlace) => place.name === booking.workingPlace
            )
            return place ? (
              <div key={booking.user} className='mt-4'>
                <p>
                  {booking.user} sitzt auf {place.displayName}
                </p>
              </div>
            ) : null
          })}
        <h2 className='text-xl font-bold mt-6'>Verfügbare Plätze</h2>
        <ul className='list-disc list-inside'>
          {availablePlaces?.map((place: WorkingPlace) => (
            <li key={place.name}>{place.displayName}</li>
          ))}
        </ul>
      </div>
    </Wrapper>
  )
}

export default Hero
