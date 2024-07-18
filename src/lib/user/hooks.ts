import {
  CalendarAbsence,
  CalendarHomeOfficeDay,
  User,
  UserAbsencesAndHomeOfficeDays
} from '@/api-lib/types'
import { fetcher } from '@/lib/fetch'
import { useEffect, useState } from 'react'
import { formatDate, formatDateISOString } from '../default'
import useSWR from 'swr'

export function useCurrentUser() {
  return useSWR('/api/user', fetcher)
}

export function useUsers() {
  return useSWR('/api/users', fetcher)
}

export function useUser(id: string) {
  return useSWR(`/api/users/${id}`, fetcher)
}
