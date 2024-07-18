import useSWR from 'swr'
import { fetcher } from '@/lib/fetch'
import { formatDateISOString } from '../default'

// Fetch all dayBookings
export function useDayBookings() {
  return useSWR('/api/dayBookings', fetcher)
}

// Fetch booking for a specific date
//export function useDayBooking(date: string) {
//return useSWR(`/api/dayBookings/${date}`, fetcher)
//}

export function useDayBooking(date: string) {
  // Format the date string as needed (YYYY-MM-DD or any format consistent with your backend)
  const formattedDate = formatDateISOString(new Date(date)) // Example: "2023-07-09"
  return useSWR(`/api/dayBookings/${formattedDate}`, fetcher)
}
