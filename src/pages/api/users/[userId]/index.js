import { findUserById, deleteUserById } from '@/api-lib/db'
import { getMongoDb } from '@/api-lib/mongodb'
import { ncOpts } from '@/api-lib/nc'
import nc from 'next-connect'

const handler = nc(ncOpts)

handler.get(async (req, res) => {
  if (!req.user) {
    return res.status(401).end()
  }

  const db = await getMongoDb()
  const user = await findUserById(db, req.query.userId)
  res.json({ user })
})

handler.delete(async (req, res) => {
  const db = await getMongoDb()
  const { userId } = req.query

  if (!userId) {
    res.status(400).json({ error: 'User ID is required' })
    return
  }

  const result = await deleteUserById(db, userId)

  if (result.deletedCount === 0) {
    res.status(404).json({ error: 'User not found' })
    return
  }

  res.status(200).json({ message: 'User deleted successfully' })
})

export default handler
