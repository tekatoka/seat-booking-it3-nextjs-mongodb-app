import {
  CalendarAbsence,
  CalendarHomeOfficeDay,
  User,
  UserAbsencesAndHomeOfficeDays
} from '@/api-lib/types'
import { useEffect, useState } from 'react'
import { useFormState } from 'react-dom'
import { isUserAbsentOnDate, isUserAbsentToday } from '../dayBooking/utils'
import {
  formatDateISOString,
  getDatesBetween,
  normalizeDateUTC
} from '../default'

const daysOfWeek = ['So', 'Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa']

const convertWeekdayToDates = (
  weekday: string,
  startDate: Date,
  endDate: Date
): string[] => {
  const dayIndex = daysOfWeek.indexOf(weekday.replace('.', ''))
  if (dayIndex === -1) return []

  const dates: string[] = []
  const currentDate = normalizeDateUTC(new Date(startDate))

  while (currentDate <= endDate) {
    if (currentDate.getDay() === dayIndex) {
      const normalizedDate = normalizeDateUTC(new Date(currentDate))
      dates.push(formatDateISOString(normalizedDate))
    }
    currentDate.setDate(currentDate.getDate() + 1)
  }

  return dates
}

export const useUserAbsencesAndHomeOfficeDays = (
  users: User[],
  startDate: Date,
  endDate: Date
): UserAbsencesAndHomeOfficeDays => {
  const [absences, setAbsences] = useState<CalendarAbsence[]>([])
  const [homeOfficeDays, setHomeOfficeDays] = useState<CalendarHomeOfficeDay[]>(
    []
  )

  useEffect(() => {
    const userAbsences: CalendarAbsence[] = []
    const userHomeOfficeDays: CalendarHomeOfficeDay[] = []

    users &&
      users.forEach(user => {
        user.absences?.forEach(absence => {
          if (absence.type === 'default') {
            userAbsences.push({
              user: user.username,
              from: formatDateISOString(absence.from),
              till: absence.till
                ? formatDateISOString(absence.till)
                : undefined,
              color: user.color || '#f56c6c', // red = default,
              type: 'default'
            })
          } else if (absence.type === 'homeOffice') {
            const from = new Date(absence.from)
            const till = absence.till
              ? new Date(absence.till)
              : new Date(endDate)
            till.setHours(23, 59, 59) // Set till to the end of the day

            const dates = getDatesBetween(from, till)
            dates.forEach(date => {
              userHomeOfficeDays.push({
                user: user.username,
                date: formatDateISOString(date),
                color: user.color || '#67c23a'
              })
            })
          }
        })
        if (user.username == 'Iljana') debugger
        user.homeOfficeDays?.forEach(day => {
          const dates = convertWeekdayToDates(day, startDate, endDate)
          dates.forEach(date => {
            const existsHomeoffice = userHomeOfficeDays.some(
              homeOfficeDay =>
                homeOfficeDay.user === user.username &&
                homeOfficeDay.date === date
            )
            if (
              !existsHomeoffice &&
              !isUserAbsentOnDate(user, normalizeDateUTC(new Date(date)))
            ) {
              userHomeOfficeDays.push({
                user: user.username,
                date: date
              })
            }
          })
        })
      })

    setAbsences(userAbsences)
    setHomeOfficeDays(userHomeOfficeDays)
  }, [users, startDate, endDate])

  return { absences, homeOfficeDays }
}
