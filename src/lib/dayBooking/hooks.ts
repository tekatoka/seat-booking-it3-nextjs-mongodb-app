import useSWR from 'swr'
import { fetcher } from '@/lib/fetch'

// Fetch all dayBookings
export function useDayBookings() {
  return useSWR('/api/dayBookings', fetcher)
}

// Fetch booking for a specific date
export function useDayBooking(date: string) {
  return useSWR(`/api/dayBookings/${date}`, fetcher)
}
