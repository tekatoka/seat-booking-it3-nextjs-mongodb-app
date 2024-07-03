import { findUserByUsername, updateUserById } from '@/api-lib/db'
import { auths, validateBody } from '@/api-lib/middlewares'
import { getMongoDb } from '@/api-lib/mongodb'
import { ncOpts } from '@/api-lib/nc'
import { slugUsername } from '@/lib/user'
import multer from 'multer'
import nc from 'next-connect'
import { ValidateProps } from '@/api-lib/constants'
import path from 'path'
import fs from 'fs'

// Ensure the 'public/images' directory exists
const imagesDirectory = path.join(process.cwd(), 'public', 'images')
if (!fs.existsSync(imagesDirectory)) {
  fs.mkdirSync(imagesDirectory, { recursive: true })
}

// Configure multer to save files to the 'public/images' directory
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, imagesDirectory)
  },
  filename: (req, file, cb) => {
    const username = req.user?.username
    const extension = path.extname(file.originalname)
    const fileName = username ? `${username}${extension}` : file.originalname
    cb(null, `${Date.now()}-${fileName}`)
  }
})

const upload = multer({ storage })

const handler = nc(ncOpts)

handler.use(...auths)

handler.get((req, res) => {
  if (!req.user) return res.json({ user: null })
  return res.json({ user: req.user })
})

handler.patch(
  upload.single('profilePicture'),
  validateBody({
    type: 'object',
    properties: {
      username: ValidateProps.user.username,
      name: ValidateProps.user.name,
      bio: ValidateProps.user.bio
    },
    additionalProperties: true
  }),
  async (req, res) => {
    if (!req.user) {
      res.status(401).end()
      return
    }

    const db = await getMongoDb()

    let profilePicture
    if (req.file) {
      // Delete the previous profile picture if it exists
      if (req.user.profilePicture) {
        const oldProfilePicturePath = path.join(
          process.cwd(),
          'public',
          req.user.profilePicture
        )
        if (fs.existsSync(oldProfilePicturePath)) {
          fs.unlinkSync(oldProfilePicturePath)
        }
      }

      // Save the new profile picture
      profilePicture = `/images/${req.file.filename}`
    }
    const { name, bio } = req.body

    let username

    if (req.body.username) {
      username = slugUsername(req.body.username)
      if (
        username !== req.user.username &&
        (await findUserByUsername(db, username))
      ) {
        res
          .status(403)
          .json({ error: { message: 'The username has already been taken.' } })
        return
      }
    }

    const user = await updateUserById(db, req.user._id, {
      ...(username && { username }),
      ...(name && { name }),
      ...(typeof bio === 'string' && { bio }),
      ...(profilePicture && { profilePicture })
    })

    res.json({ user })
  }
)

export const config = {
  api: {
    bodyParser: false
  }
}

export default handler
