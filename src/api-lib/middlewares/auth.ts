import { passport } from '@/api-lib/auth'
import session from './session' // Ensure this module exports middleware correctly
import { RequestHandler } from 'express'

// Define the array holding the authentication middleware
const auths: RequestHandler[] = [
  session,
  passport.initialize(),
  passport.session()
]

export default auths
