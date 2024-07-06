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

export const formatDateAsString = (date: Date): string => {
  const day = String(date.getDate()).padStart(2, '0')
  const month = String(date.getMonth() + 1).padStart(2, '0') // Months are zero-based
  const year = date.getFullYear()
  return `${day}.${month}.${year}`
}
