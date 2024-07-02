import slug from 'slug'

export const slugUsername = (username: string): string => slug(username, '_')
