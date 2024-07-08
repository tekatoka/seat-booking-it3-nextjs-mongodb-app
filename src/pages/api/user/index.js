import { updateUserById } from '@/api-lib/db'
import { auths, validateBody } from '@/api-lib/middlewares'
import { getMongoDb } from '@/api-lib/mongodb'
import { ncOpts } from '@/api-lib/nc'
import { v2 as cloudinary } from 'cloudinary'
import multer from 'multer'
import nc from 'next-connect'
import { ValidateProps } from '@/api-lib/constants'

const upload = multer({ dest: '/tmp' })
const handler = nc(ncOpts)

if (process.env.CLOUDINARY_URL) {
  const {
    hostname: cloud_name,
    username: api_key,
    password: api_secret
  } = new URL(process.env.CLOUDINARY_URL)

  cloudinary.config({
    cloud_name,
    api_key,
    api_secret
  })
}

handler.use(...auths)

handler.get((req, res) => {
  if (!req.user) return res.json({ user: null })
  return res.json({ user: req.user })
})
//todo: favourite places, absence times
handler.patch(
  upload.single('profilePicture'),
  validateBody({
    type: 'object',
    properties: {
      username: ValidateProps.user.username
      //absences: ValidateProps.user.absences
    },
    additionalProperties: true
  }),
  async (req, res) => {
    if (!req.user) {
      req.status(401).end()
      return
    }

    const db = await getMongoDb()

    let profilePicture
    if (req.file) {
      const image = await cloudinary.uploader.upload(req.file.path, {
        width: 512,
        height: 512,
        crop: 'fill'
      })
      profilePicture = image.secure_url
    }
    const { _id, username } = req.body

    let absences
    if (req.body.absences) {
      absences = JSON.parse(req.body.absences)
      absences = absences.map(absence => ({
        ...absence,
        from: new Date(absence.from),
        till: absence.till ? new Date(absence.till) : null
      }))
    }

    let favouritePlaces
    if (req.body.favouritePlaces) {
      favouritePlaces = JSON.parse(req.body.favouritePlaces)
    }

    // if (req.body.username) {
    //   username = slugUsername(req.body.username)
    //   if (
    //     username !== req.user.username &&
    //     (await findUserByUsername(db, username))
    //   ) {
    //     res
    //       .status(403)
    //       .json({ error: { message: 'The username has already been taken.' } })
    //     return
    //   }
    // }
    const user = await updateUserById(db, _id, {
      ...(username && { username }),
      ...(absences && { absences }),
      ...(favouritePlaces && { favouritePlaces }),
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
