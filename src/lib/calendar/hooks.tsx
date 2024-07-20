import {
  CalendarAbsence,
  CalendarHomeOfficeDay,
  User,
  UserAbsencesAndHomeOfficeDays
} from '@/api-lib/types'
import { useEffect, useState } from 'react'
import { formatDateISOString } from '../default'

const daysOfWeek = ['So', 'Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa']

const convertWeekdayToDates = (
  weekday: string,
  startDate: Date,
  endDate: Date
): string[] => {
  const dayIndex = daysOfWeek.indexOf(weekday.replace('.', ''))
  if (dayIndex === -1) return []

  const dates: string[] = []
  const currentDate = new Date(startDate)

  while (currentDate <= endDate) {
    if (currentDate.getDay() === dayIndex) {
      dates.push(new Date(currentDate).toISOString())
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
          userAbsences.push({
            user: user.username,
            from: formatDateISOString(absence.from),
            till: absence.till ? formatDateISOString(absence.till) : undefined,
            color: user.color || '#f56c6c' //red = default
          })
        })

        user.homeOfficeDays?.forEach(day => {
          const dates = convertWeekdayToDates(day, startDate, endDate)
          dates.forEach(date => {
            userHomeOfficeDays.push({
              user: user.username,
              date: date
            })
          })
        })
      })

    setAbsences(userAbsences)
    setHomeOfficeDays(userHomeOfficeDays)
  }, [users, startDate, endDate])

  return { absences, homeOfficeDays }
}
