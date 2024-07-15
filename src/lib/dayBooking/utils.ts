import { User, WorkingPlace, DayBooking, Booking } from '@/api-lib/types'
import { toast } from 'react-hot-toast'
import { getLocalDate, normalizeDateUTC } from '../default'

const RESERVED_PLACE = 'Eichhörnchen'

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
    .filter(
      (place: WorkingPlace) =>
        place.isActive &&
        !excludedPlaces.includes(place.name) &&
        place.displayName != RESERVED_PLACE
    )
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
  if (
    workingPlacesData.workingPlaces == null ||
    workingPlacesData.workingPlaces?.length == 0
  ) {
    toast.error('Es wurden noch keine Arbeitzsplätze angelegt!', {
      duration: 5000
    })
    return null
  }

  const user = getUserByUsername(selectedUser, userData)
  if (!user) {
    throw new Error(`Benutzer ${selectedUser} nicht gefunden!`)
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

  if (user.username == 'Dana') {
    placeToBook = RESERVED_PLACE
  } else {
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
  }

  const newBooking: Booking = {
    user: selectedUser,
    workingPlace: placeToBook.toLowerCase(),
    createdAt: getLocalDate(new Date())
  }

  return newBooking
}
