import { Db, ObjectId } from 'mongodb'
import { NewUser, User, Absence } from '../types/User'
import bcrypt from 'bcryptjs'
import normalizeEmail from 'validator/lib/normalizeEmail'
import { capitalizeUsername } from '@/lib/user'

//finds all users
export async function findAllUsers(db: Db): Promise<Omit<User, 'password'>[]> {
  const users = await db.collection<User>('users').find().toArray()

  // Remove passwords from user objects
  return users.map(
    ({ password, ...userWithoutPassword }) => userWithoutPassword
  )
}

// Finds a user by email and password, verifying password correctness
export async function findUserWithNameAndPassword(
  db: Db,
  username: string,
  password: string
): Promise<Omit<User, 'password'> | null> {
  username = username || ''
  const user = await db.collection<User>('users').findOne({ username })

  // Ensure user exists and has a defined password before comparing
  if (
    user &&
    user.password &&
    (await bcrypt.compare(password, user.password))
  ) {
    const { password, ...userWithoutPassword } = user
    return userWithoutPassword
  }
  return null
}

// Finds a user for authentication purposes, excluding the password
export async function findUserForAuth(
  db: Db,
  userId: string
): Promise<User | null> {
  return db
    .collection<User>('users')
    .findOne({ _id: new ObjectId(userId) }, { projection: { password: 0 } })
}

// Finds a user by user ID
export async function findUserById(
  db: Db,
  userId: string
): Promise<User | null> {
  return db
    .collection<User>('users')
    .findOne({ _id: new ObjectId(userId) }, { projection: dbProjectionUsers() })
}

// Finds a user by username
export async function findUserByUsername(
  db: Db,
  username: string
): Promise<User | null> {
  username = capitalizeUsername(username)
  return db
    .collection<User>('users')
    .findOne({ username }, { projection: dbProjectionUsers() })
}

// Finds a user by email
export async function findUserByEmail(
  db: Db,
  email: string
): Promise<User | null> {
  email = normalizeEmail(email) || ''
  return db
    .collection<User>('users')
    .findOne({ email }, { projection: dbProjectionUsers() })
}

// Updates user by ID, returning the updated user excluding the password
export async function updateUserById(
  db: Db,
  id: string,
  data: Partial<User>
): Promise<User | null> {
  return db
    .collection<User>('users')
    .findOneAndUpdate(
      { _id: new ObjectId(id) },
      { $set: data },
      { returnDocument: 'after', projection: { password: 0 } }
    )
    .then(result => result.value || null)
}

// Inserts a new user with hashed password
export async function insertUser(
  db: Db,
  newUserDetails: NewUser
): Promise<Omit<User, 'password'>> {
  const hashedPassword = await bcrypt.hash(newUserDetails.originalPassword, 10)
  const user: User = {
    email: newUserDetails.email,
    username: newUserDetails.username,
    profilePicture: newUserDetails.profilePicture,
    password: hashedPassword,
    isAdmin: newUserDetails.isAdmin,
    createdAt: new Date()
  }

  const { insertedId } = await db.collection<User>('users').insertOne(user)
  const { password, ...userWithoutPassword } = user // Exclude password from the return value
  return { ...userWithoutPassword, _id: insertedId }
}

// Updates user's password by verifying the old password first
export async function updateUserPasswordByOldPassword(
  db: Db,
  id: string,
  oldPassword: string,
  newPassword: string
): Promise<boolean> {
  const user = await db
    .collection<User>('users')
    .findOne({ _id: new ObjectId(id) })
  if (!user || !user.password) return false
  const matched = await bcrypt.compare(oldPassword, user.password)
  if (!matched) return false
  const hashedNewPassword = await bcrypt.hash(newPassword, 10)
  await db
    .collection('users')
    .updateOne(
      { _id: new ObjectId(id) },
      { $set: { password: hashedNewPassword } }
    )
  return true
}

// UNSAFE: Updates user's password directly
export async function UNSAFE_updateUserPassword(
  db: Db,
  id: string,
  newPassword: string
): Promise<void> {
  const password = await bcrypt.hash(newPassword, 10)
  await db
    .collection('users')
    .updateOne({ _id: new ObjectId(id) }, { $set: { password } })
}

// Returns a projection object for user queries
export function dbProjectionUsers(prefix: string = ''): Record<string, number> {
  return {
    [`${prefix}password`]: 0
  }
}
