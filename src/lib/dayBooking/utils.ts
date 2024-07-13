import { User, WorkingPlace, DayBooking, Booking } from '@/api-lib/types'
import { normalizeDateUTC } from '../default'

export const getUserByUsername = (
  username: string,
  usersData: { users: User[] }
): User | null => {
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

export const isUserAbsentToday = (user: User): boolean => {
  const today = new Date()
  today.setHours(0, 0, 0, 0) // Normalize to midnight

  if (!user.absences) {
    return false
  }
  return user.absences.some(absence => {
    const from = normalizeDateUTC(new Date(absence.from))
    const till = absence.till ? normalizeDateUTC(new Date(absence.till)) : null
    return from <= today && (!till || till >= today)
  })
}

export const getUsersNotAbsent = (usersData: { users: User[] }): User[] => {
  const presentUsers = usersData?.users?.filter((user: User) => {
    const isAbsentToday = isUserAbsentToday(user)
    return !isAbsentToday
  })

  return presentUsers
}

export const getUsersNotAbsentAndNoBooking = (
  dayBooking: DayBooking,
  usersData: { users: User[] }
): User[] => {
  const usersWithNoBookingToday = usersData?.users?.filter((user: User) => {
    const hasBookingToday = dayBooking?.bookings.some(
      booking => booking.user?.toLowerCase() === user.username?.toLowerCase()
    )
    const isAbsentToday = isUserAbsentToday(user)
    return !hasBookingToday && !isAbsentToday
  })

  return usersWithNoBookingToday
}

export const getNewBooking = (
  selectedUser: string,
  todayBooking: DayBooking,
  workingPlacesData: { workingPlaces: WorkingPlace[] },
  userData: { users: User[] }
): Booking | null => {
  if (!todayBooking) return null

  const user = getUserByUsername(selectedUser, userData)
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

// export function normalizeDateUTC(date: string): Date {
//   const normalizedDate = new Date(date)
//   normalizedDate.setUTCHours(0, 0, 0, 0) // Normalize to UTC midnight
//   return normalizedDate
// }
