import useSWR from 'swr'
import { fetcher } from '@/lib/fetch'

// Fetch all working places
export function useWorkingPlaces() {
  return useSWR('/api/workingPlaces', fetcher)
}

// Fetch a specific working place by ID
export function useWorkingPlace(id: string) {
  return useSWR(`/api/workingPlaces/${id}`, fetcher)
}
