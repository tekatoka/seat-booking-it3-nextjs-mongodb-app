import slug from 'slug'

export const slugUsername = (username: string): string => slug(username, '_')

export const capitalizeString = (name: string): string => {
  if (!name) return ''
  return name.charAt(0).toUpperCase() + name.slice(1).toLowerCase()
}
