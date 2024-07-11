import { User, WorkingPlace, DayBooking, Booking } from '@/api-lib/types'
import { useUsers } from '@/lib/user' // Adjust the import path as needed
import { useWorkingPlaces } from '@/lib/workingPlace' // Adjust the import path as needed

export const getUserByUsername = async (
  username: string,
  usersData: { users: User[] }
): Promise<User | null> => {
  const user = usersData?.users.find(
    (user: User) =>
      user.username.toLocaleLowerCase() === username.toLocaleLowerCase()
  )
  return user ?? null
}

export const getRandomPlace = (
  excludedPlaces: string[],
  workingPlacesData: { workingPlaces: WorkingPlace[] }
): string => {
  const availablePlaces = workingPlacesData?.workingPlaces
    .filter((place: WorkingPlace) => !excludedPlaces.includes(place.name))
    .map((place: WorkingPlace) => place.name)
  return availablePlaces[Math.floor(Math.random() * availablePlaces?.length)]
}

export const isUserAbsentToday = (user: User, today: Date): boolean => {
  if (!user.absences) {
    return false
  }
  return user.absences.some(absence => {
    const from = new Date(absence.from)
    const till = absence.till ? new Date(absence.till) : null
    return from <= today && (!till || till >= today)
  })
}

export const getUsersNotAbsentAndNoBooking = async (
  dayBooking: DayBooking,
  usersData: { users: User[] }
): Promise<User[]> => {
  const today = new Date()
  today.setHours(0, 0, 0, 0) // Normalize to midnight

  const usersWithNoBookingToday = usersData?.users?.filter((user: User) => {
    const hasBookingToday = dayBooking?.bookings.some(
      booking => booking.user?.toLowerCase() === user.username?.toLowerCase()
    )
    const isAbsentToday = isUserAbsentToday(user, today)
    return !hasBookingToday && !isAbsentToday
  })

  return usersWithNoBookingToday
}

export const getNewBooking = async (
  selectedUser: string,
  todayBooking: DayBooking,
  workingPlacesData: { workingPlaces: WorkingPlace[] },
  userData: any
): Promise<Booking | null> => {
  if (!todayBooking) return null

  const today = new Date()
  today.setHours(0, 0, 0, 0) // Normalize to midnight

  const user = await getUserByUsername(selectedUser, userData)
  if (!user) {
    throw new Error(`User ${selectedUser} not found`)
  }
  if (!user) {
    throw new Error(`User ${selectedUser} not found`)
  }

  user.favouritePlaces = user.favouritePlaces?.filter(
    p => p !== null && p !== ''
  )
  if (todayBooking.bookings.some(booking => booking.user === selectedUser)) {
    console.log(`User ${selectedUser} already has a booking for today`)
    return null
  }

  const takenPlaces = todayBooking.bookings.map(booking => booking.workingPlace)
  const leastPreferredPlaces = ['wombat', 'yoda']

  const allOtherPlacesTaken = workingPlacesData?.workingPlaces.map(
    (place: WorkingPlace) => place.name
  )
  // TODO: Implement your logic for least preferred places
  // .filter(placeName => !leastPreferredPlaces.includes(placeName))
  // .every(placeName => takenPlaces.includes(placeName))

  let placeToBook =
    user.favouritePlaces?.find(place => !takenPlaces.includes(place)) ??
    getRandomPlace(takenPlaces, workingPlacesData)

  if (allOtherPlacesTaken) {
    placeToBook =
      user.favouritePlaces?.find(place => !takenPlaces.includes(place)) ??
      getRandomPlace(takenPlaces, workingPlacesData)
  } else {
    while (
      takenPlaces.includes(placeToBook) ||
      leastPreferredPlaces.includes(placeToBook)
    ) {
      placeToBook = getRandomPlace(takenPlaces, workingPlacesData)
    }
  }

  const newBooking: Booking = {
    user: selectedUser,
    workingPlace: placeToBook.toLowerCase()
  }

  return newBooking
}

export const formatDate = (date: Date) => {
  return new Date(date).toLocaleDateString('de-DE', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  })
}
