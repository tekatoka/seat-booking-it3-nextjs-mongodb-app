import {
  User,
  WorkingPlace,
  DayBooking,
  Booking,
  AbsenceType
} from '@/api-lib/types'
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

export const isUserAbsentToday = (user: User): boolean => {
  const today = normalizeDateUTC(new Date())
  if (!user.absences) {
    return false
  }

  return getAbsenceByTypeAndDate(user, 'default', today)
}

export const isUserAbsentOnDate = (user: User, date: Date): boolean => {
  const selectedDate = normalizeDateUTC(date)
  if (!user.absences) {
    return false
  }
  return getAbsenceByTypeAndDate(user, 'default', selectedDate)
}

export const isUserInHomeOffice = (user: User): boolean => {
  if (!user.homeOfficeDays && !user.absences) {
    return false
  }

  const today = normalizeDateUTC(new Date())
  //today.setHours(0, 0, 0, 0) // Normalize to midnight
  const weekday = today.toLocaleDateString('de-DE', { weekday: 'short' }) + '.'

  const homeOfficeToday = getAbsenceByTypeAndDate(user, 'homeOffice', today)

  return (
    (user.homeOfficeDays?.includes(weekday) || homeOfficeToday) &&
    !isUserAbsentToday(user)
  )
}

const getAbsenceByTypeAndDate = (
  user: User,
  type: AbsenceType,
  today: Date
) => {
  return user.absences
    ? user.absences
        .filter(a => a.type == type)
        ?.some(absence => {
          const from = normalizeDateUTC(new Date(absence.from))
          const till = absence.till
            ? normalizeDateUTC(new Date(absence.till))
            : null
          return from <= today && (!till || till >= today)
        })
    : false
}

export const getUsersNotAbsent = (usersData: { users: User[] }): User[] => {
  const presentUsers = usersData?.users?.filter((user: User) => {
    const isAbsentToday = isUserAbsentToday(user)
    const isInHomeOfficeToday = isUserInHomeOffice(user)
    return !isAbsentToday && !isInHomeOfficeToday
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
    toast.error('Du hast heute bereits einen Arbeitsplatz gebucht!', {
      duration: 5000
    })
    console.log(`User ${selectedUser} already has a booking for today`)
    return null
  }

  const presentUsers = getUsersNotAbsent(userData).filter(
    u =>
      u._id != user._id &&
      !todayBooking.bookings.some(booking => booking.user === u.username)
  )

  const takenPlaces = todayBooking.bookings.map(booking => booking.workingPlace)
  const leastPreferredPlaces = ['wombat', 'yoda']

  const reservedPlaces = presentUsers.reduce((acc: string[], u) => {
    if (
      u.favouritePlaces &&
      u.favouritePlaces[0] != null &&
      u.favouritePlaces[0] != '' &&
      !takenPlaces.includes(u.favouritePlaces[0])
    ) {
      acc.push(u.favouritePlaces[0])
    } else if (
      u.favouritePlaces &&
      u.favouritePlaces[1] != null &&
      u.favouritePlaces[1] != '' &&
      !takenPlaces.includes(u.favouritePlaces[1])
    ) {
      acc.push(u.favouritePlaces[1])
    }
    return acc
  }, [])

  let placeToBook = ''
  if (user.username === 'Dana') {
    placeToBook = RESERVED_PLACE
  } else {
    placeToBook = getPlaceToBook(
      user,
      takenPlaces,
      reservedPlaces,
      leastPreferredPlaces,
      workingPlacesData
    )
  }

  const newBooking: Booking = {
    user: selectedUser,
    workingPlace: placeToBook.toLowerCase(),
    createdAt: getLocalDate(new Date())
  }

  return newBooking
}

const getPlaceToBook = (
  user: User,
  takenPlaces: string[],
  reservedPlaces: string[],
  leastPreferredPlaces: string[],
  workingPlacesData: { workingPlaces: WorkingPlace[] }
): string => {
  // Try to get a favorite place
  let placeToBook = user.favouritePlaces?.find(
    place => !takenPlaces.includes(place)
  )

  if (!placeToBook) {
    // Get a random place excluding taken and least preferred places
    placeToBook = getRandomPlace(
      [...takenPlaces, ...reservedPlaces, ...leastPreferredPlaces],
      workingPlacesData
    )
  }

  if (!placeToBook) {
    // If no places are available, get a least preferred place
    placeToBook = getRandomPlace(takenPlaces, {
      workingPlaces: workingPlacesData.workingPlaces.filter(place =>
        leastPreferredPlaces.includes(place.name)
      )
    })
  }

  return placeToBook
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
