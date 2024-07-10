import { Button } from '@/components/Button'
import { Container, Spacer, Wrapper } from '@/components/Layout'
import { ObjectId } from 'mongodb'
import { useEffect, useState } from 'react'
import { DropdownSelect, Option } from '@/components/DropdownSelect'
import { Modal } from '@/components/Modal'
import { LoadingDots } from '@/components/LoadingDots'
import { User, WorkingPlace, DayBooking, Booking } from '@/api-lib/types'
import { useUsers } from '@/lib/user'
import { useWorkingPlaces } from '@/lib/workingPlace'
import { useDayBooking, useDayBookings } from '@/lib/dayBooking'
import { useRouter } from 'next/router'

const Hero: React.FC = () => {
  const [absentUsers, setAbsentUsers] = useState<User[]>()
  const [availableUsers, setAvailableUsers] = useState<User[]>()
  const [selectedUser, setSelectedUser] = useState<string | undefined>()
  const [availableUserOptions, setAvailableUserOptions] = useState<Option[]>([])
  const [allBookings, setAllBookings] = useState<DayBooking | null>(null)
  const [isClient, setIsClient] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [modalContent, setModalContent] = useState<React.ReactNode>(null)

  const { data: usersData, error: usersError } = useUsers()
  const { data: workingPlacesData, error: workingPlacesError } =
    useWorkingPlaces()
  const { data: daybookingsData, error: daybookingsError } = useDayBookings()
  const { data: daybookingData, error: daybookingError } = useDayBooking(
    new Date().toString()
  )

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
    //TODO!!! update in the database
  }

  const getUserByUsername = async (username: string): Promise<User | null> => {
    const user = await usersData?.users.find(
      (user: User) =>
        user.username.toLocaleLowerCase() === username.toLocaleLowerCase()
    )
    return user ?? null
  }

  const getRandomPlace = (excludedPlaces: string[]): string => {
    const availablePlaces = workingPlacesData?.workingPlaces
      .filter((place: WorkingPlace) => !excludedPlaces.includes(place.name))
      .map((place: WorkingPlace) => place.name)
    return availablePlaces[Math.floor(Math.random() * availablePlaces?.length)]
  }

  const isUserAbsentToday = (user: User, today: Date): boolean => {
    if (!user.absences) {
      return false
    }
    return user.absences.some(absence => {
      const from = new Date(absence.from)
      const till = absence.till ? new Date(absence.till) : null
      return from <= today && (!till || till >= today)
    })
  }

  const getUsersNotAbsentAndNoBooking = async (
    dayBooking: DayBooking
  ): Promise<User[]> => {
    const today = new Date()
    today.setHours(0, 0, 0, 0) // Normalize to midnight

    const usersWithNoBookingToday = await usersData?.users.filter(
      (user: User) => {
        const hasBookingToday = dayBooking?.bookings.some(
          booking =>
            booking.user?.toLowerCase() === user.username?.toLowerCase()
        )
        const isAbsentToday = isUserAbsentToday(user, today)
        return !hasBookingToday && !isAbsentToday
      }
    )

    return usersWithNoBookingToday
  }

  useEffect(() => {
    const getAvailableUsers = async () => {
      const today = new Date()
      today.setHours(0, 0, 0, 0) // Normalize to midnight

      const dayBooking = daybookingData?.dayBooking
      if (dayBooking) {
        const availableUsers = await getUsersNotAbsentAndNoBooking(dayBooking)
        setAvailableUsers(availableUsers)
        setAllBookings(dayBooking)
      } else {
        const newDayBooking = await createDayBooking(today)
        setAllBookings(newDayBooking)
        const availableUsers = await getUsersNotAbsentAndNoBooking(
          newDayBooking
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
    setIsClient(true)
  }, [])

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

  const handleSubmit = async (selectedUser: string) => {
    if (!allBookings) return

    const today = new Date()
    today.setHours(0, 0, 0, 0) // Normalize to midnight

    const user = await getUserByUsername(selectedUser)
    if (!user) {
      throw new Error(`User ${selectedUser} not found`)
    }

    user.favouritePlaces = user.favouritePlaces?.filter(
      p => p !== null && p !== ''
    )
    if (allBookings.bookings.some(booking => booking.user === selectedUser)) {
      console.log(`User ${selectedUser} already has a booking for today`)
      return
    }

    const takenPlaces = allBookings.bookings.map(
      booking => booking.workingPlace
    )
    const leastPreferredPlaces = ['wombat', 'yoda']

    // Check if all non-least preferred places are taken
    const allOtherPlacesTaken = workingPlacesData?.workingPlaces.map(
      (place: WorkingPlace) => place.name
    )
    //TODO!!!
    // .filter(placeName => !leastPreferredPlaces.includes(placeName))
    // .every(placeName => takenPlaces.includes(placeName))

    let placeToBook =
      user.favouritePlaces?.find(place => !takenPlaces.includes(place)) ??
      getRandomPlace(takenPlaces)

    // If all other places are taken, allow least preferred places to be selected
    if (allOtherPlacesTaken) {
      placeToBook =
        user.favouritePlaces?.find(place => !takenPlaces.includes(place)) ??
        getRandomPlace(takenPlaces)
    } else {
      // If all other places are not taken, do not assign least preferred places
      while (
        takenPlaces.includes(placeToBook) ||
        leastPreferredPlaces.includes(placeToBook)
      ) {
        placeToBook = getRandomPlace(takenPlaces)
      }
    }

    const newBooking: Booking = {
      user: selectedUser,
      workingPlace: placeToBook.toLowerCase()
    }
    const updatedBookings = {
      ...allBookings,
      bookings: [...allBookings.bookings, newBooking]
    }

    // Show modal with loading spinner and then display the assigned seat
    setIsModalOpen(true)
    setModalContent(<LoadingDots />)
    setTimeout(async () => {
      const place = workingPlacesData?.workingPlaces.find(
        (p: WorkingPlace) => p.name?.toLowerCase() === placeToBook.toLowerCase()
      )
      if (place) {
        setModalContent(
          <div className='text-center'>
            <p className='text-xl font-bold mb-4'>Assigned Seat</p>
            <p className='text-2xl font-bold'>{place.displayName}</p>
          </div>
        )

        setAllBookings(updatedBookings)
        await updateDayBooking(updatedBookings)

        // Update available users
        const updatedAvailableUsers = availableUsers?.filter(
          user => user.username !== selectedUser
        )
        setAvailableUsers(updatedAvailableUsers)
        setSelectedUser(undefined) // Clear the selected user
      }
    }, 2000) // 2 second delay for loading effect
  }

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('de-DE', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    })
  }

  const availablePlaces = workingPlacesData?.workingPlaces.filter(
    (place: WorkingPlace) =>
      !allBookings?.bookings.some(
        booking => booking.workingPlace === place.name
      )
  )

  return (
    <Wrapper>
      <div className='container mx-auto p-4'>
        {allBookings && <>Total bookings: {allBookings?.bookings.length}</>}
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
        <h1 className='text-2xl font-bold mb-4'>Select a Place</h1>
        {isClient && (
          <div className='flex flex-col sm:flex-row sm:space-x-4 space-y-4 sm:space-y-0'>
            <DropdownSelect
              options={availableUserOptions}
              onChange={handleChange}
              placeholder='Select a place...'
              value={
                availableUserOptions.find(
                  option => option.value === selectedUser
                ) || null
              } // Set the selected value
            />
            <Button
              size='medium'
              variant='primary'
              type='button'
              disabled={!selectedUser}
              onClick={() => selectedUser && handleSubmit(selectedUser)}
            >
              Figur erfahren!
            </Button>
          </div>
        )}
        {allBookings &&
          allBookings.bookings.map(booking => {
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
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        {modalContent}
      </Modal>
    </Wrapper>
  )
}

export default Hero
