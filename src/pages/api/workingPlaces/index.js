import { ValidateProps } from '@/api-lib/constants'
import { findAllWorkingPlaces, addWorkingPlace } from '@/api-lib/db'
import { auths, validateBody } from '@/api-lib/middlewares'
import { getMongoDb } from '@/api-lib/mongodb'
import { ncOpts } from '@/api-lib/nc'
import nc from 'next-connect'

const handler = nc(ncOpts)

handler.get(async (req, res) => {
  const db = await getMongoDb()
  const workingPlaces = await findAllWorkingPlaces(db)
  res.json({ workingPlaces })
})

handler.post(
  async (req, res, next) => {
    if (req.body.isActive) {
      req.body.isActive = JSON.parse(req.body.isActive)
    }
    next()
  },
  validateBody({
    type: 'object',
    properties: {
      name: ValidateProps.workingPlace.name,
      displayName: ValidateProps.workingPlace.displayName,
      pcName: ValidateProps.workingPlace.pcName,
      isActive: ValidateProps.workingPlace.isActive
    },
    required: ['name', 'pcName'],
    additionalProperties: false
  }),
  ...auths,
  async (req, res) => {
    const db = await getMongoDb()
    const { name, pcName, displayName, image, isActive } = req.body

    const workingPlace = await addWorkingPlace(db, {
      name,
      displayName,
      pcName,
      image,
      isActive
    })

    return res.json({ workingPlace })
  }
)

export default handler
