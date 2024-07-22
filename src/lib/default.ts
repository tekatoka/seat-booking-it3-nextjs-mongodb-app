// https://github.com/tobiaslins/avatar
export const defaultProfilePicture = (id: string) =>
  `https://avatar.tobi.sh/${id}`

export const formatDate = (date: Date) => {
  return new Date(date).toLocaleDateString('de-DE', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  })
}

export const formatDateISOString = (date: Date) => {
  return new Date(date).toISOString().split('T')[0]
}

export const formatDateWithDay = (date: Date) => {
  return new Date(date).toLocaleDateString('de-DE', {
    weekday: 'short',
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  })
}

export const formatShortDate = (date: Date) => {
  const d = new Date(date)
  const day = String(d.getDate()).padStart(2, '0')
  const month = String(d.getMonth() + 1).padStart(2, '0')
  return `${day}.${month}.`
}

export const formatDateAsString = (date: Date): string => {
  const day = String(date.getDate()).padStart(2, '0')
  const month = String(date.getMonth() + 1).padStart(2, '0') // Months are zero-based
  const year = date.getFullYear()
  return `${day}.${month}.${year}`
}

export const stripTime = (date: Date): Date => {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate())
}

export const normalizeDateUTC = (date: string | Date) => {
  const localDate = new Date(date)
  const utcDate = new Date(
    Date.UTC(localDate.getFullYear(), localDate.getMonth(), localDate.getDate())
  )
  const timeOffset = utcDate.getTimezoneOffset()
  utcDate.setHours(0, 0, 0, 0)
  utcDate.setHours(utcDate.getHours() - timeOffset / 60)
  return utcDate
}

export const getLocalDate = (date: Date) => {
  const timeOffset = date.getTimezoneOffset()
  date.setHours(date.getHours() - timeOffset / 60)
  return date
}

export const getDatesBetween = (startDate: Date, endDate: Date): Date[] => {
  const dates: Date[] = []
  let currentDate = startDate
  while (currentDate <= endDate) {
    dates.push(new Date(currentDate))
    currentDate.setDate(currentDate.getDate() + 1)
  }
  return dates
}
