import { User } from '@/api-lib/types'
import slug from 'slug'

export const slugUsername = (username: string): string => slug(username, '_')

export const capitalizeString = (name: string): string => {
  if (!name) return ''
  return name.charAt(0).toUpperCase() + name.slice(1).toLowerCase()
}

export const usersSortedByUsername = (users: User[]): User[] => {
  return users
    ? [...users].sort((a, b) => a.username.localeCompare(b.username))
    : users
}
