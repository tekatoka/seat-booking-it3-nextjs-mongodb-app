import { findUserForAuth, findUserWithNameAndPassword } from '@/api-lib/db'
import passport from 'passport'
import { Strategy as LocalStrategy } from 'passport-local'
import { getMongoDb } from '../mongodb'
import { Db } from 'mongodb'
import { User } from '../types/User'

// Serialize user information to the session
passport.serializeUser((user: any, done: (err: any, id?: any) => void) => {
  done(null, user._id?.toString())
})

// Deserialize user information from the session
passport.deserializeUser(
  (id: string, done: (err: any, user?: User | null) => void) => {
    getMongoDb()
      .then((db: Db) => {
        findUserForAuth(db, id).then(
          user => done(null, user),
          err => done(err)
        )
      })
      .catch(error => done(error))
  }
)

// Define local strategy for passport
passport.use(
  new LocalStrategy(
    {
      usernameField: 'username',
      passReqToCallback: true
    },
    async (
      req: any, // Adjust type if you have a custom request type
      username: string,
      password: string,
      done: (err: any, user?: User | false, info?: { message: string }) => void
    ) => {
      try {
        const db = await getMongoDb()
        const user = await findUserWithNameAndPassword(db, username, password)
        if (user) {
          done(null, user)
        } else {
          done(null, false, { message: 'Name or password is incorrect' })
        }
      } catch (err) {
        done(err)
      }
    }
  )
)

export default passport
