import {
  findWorkingPlaceById,
  deleteWorkingPlaceById,
  updateWorkingPlaceById
} from '@/api-lib/db'
import { getMongoDb } from '@/api-lib/mongodb'
import { ncOpts } from '@/api-lib/nc'
import nc from 'next-connect'
import multer from 'multer'
import { v2 as cloudinary } from 'cloudinary'

const handler = nc(ncOpts)

const upload = multer({ dest: '/tmp' })

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

handler.get(async (req, res) => {
  const db = await getMongoDb()
  const workingPlace = await findWorkingPlaceById(db, req.query.workingPlaceId)
  res.json({ workingPlace })
})

handler.delete(async (req, res) => {
  const db = await getMongoDb()
  const { workingPlaceId } = req.query

  if (!workingPlaceId) {
    res.status(400).json({ error: 'Working Place ID is required' })
    return
  }

  const result = await deleteWorkingPlaceById(db, workingPlaceId)

  if (result.deletedCount === 0) {
    res.status(404).json({ error: 'Working Place not found' })
    return
  }

  res.status(200).json({ message: 'Working Place deleted successfully' })
})

handler.patch(upload.single('image'), async (req, res) => {
  const db = await getMongoDb()
  const { workingPlaceId } = req.query

  if (!workingPlaceId) {
    res.status(400).json({ error: 'Working Place ID is required' })
    return
  }

  let image
  if (req.file) {
    const uploadResult = await cloudinary.uploader.upload(req.file.path, {
      width: 512,
      height: 512,
      crop: 'fill'
    })
    image = uploadResult.secure_url
  }

  const updateData = {
    ...req.body,
    ...(image && { image })
  }

  const workingPlace = await updateWorkingPlaceById(
    db,
    workingPlaceId,
    updateData
  )

  if (!workingPlace) {
    res.status(404).json({ error: 'Working Place not found' })
    return
  }

  res.json({ workingPlace })
})

export default handler
