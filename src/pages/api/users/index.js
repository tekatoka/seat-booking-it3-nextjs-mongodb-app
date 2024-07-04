import { ValidateProps } from '@/api-lib/constants'
import { findAllUsers, findUserByUsername, insertUser } from '@/api-lib/db'
import { auths, validateBody } from '@/api-lib/middlewares'
import { getMongoDb } from '@/api-lib/mongodb'
import { ncOpts } from '@/api-lib/nc'
import { capitalizeUsername, slugUsername } from '@/lib/user'
import nc from 'next-connect'

const handler = nc(ncOpts)

handler.get(async (req, res) => {
  const db = await getMongoDb()
  const users = await findAllUsers(db)
  res.json({ users })
})

handler.post(
  validateBody({
    type: 'object',
    properties: {
      username: ValidateProps.user.username,
      password: ValidateProps.user.password,
      isAdmin: ValidateProps.user.isAdmin
    },
    required: ['username', 'password'],
    additionalProperties: false
  }),
  ...auths,
  async (req, res) => {
    const db = await getMongoDb()

    let { username, password, isAdmin } = req.body
    username = capitalizeUsername(req.body.username)
    if (await findUserByUsername(db, username)) {
      res
        .status(403)
        .json({ error: { message: 'The username has already been taken.' } })
      return
    }
    const user = await insertUser(db, {
      originalPassword: password,
      username,
      isAdmin
    })
    req.logIn(user, err => {
      if (err) throw err
      res.status(201).json({
        user
      })
    })
  }
)

export default handler
