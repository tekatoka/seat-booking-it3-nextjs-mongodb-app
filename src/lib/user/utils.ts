import slug from 'slug'

export const slugUsername = (username: string): string => slug(username, '_')

export const capitalizeUsername = (username: string): string => {
  if (!username) return ''
  return username.charAt(0).toUpperCase() + username.slice(1).toLowerCase()
}
