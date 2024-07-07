import { Db, ObjectId } from 'mongodb'
import { WorkingPlace } from '../types/WorkingPlace'

// Finds all working places
export async function findAllWorkingPlaces(db: Db): Promise<WorkingPlace[]> {
  return db.collection<WorkingPlace>('workingPlaces').find().toArray()
}

// Finds a user by user ID
export async function findWorkingPlaceById(
  db: Db,
  workingPlaceId: string
): Promise<WorkingPlace | null> {
  return db
    .collection<WorkingPlace>('workingPlaces')
    .findOne({ _id: new ObjectId(workingPlaceId) })
}

// Adds a new working place
export async function addWorkingPlace(
  db: Db,
  newWorkingPlace: Omit<WorkingPlace, '_id'>
): Promise<WorkingPlace> {
  const workingPlace: WorkingPlace = {
    ...newWorkingPlace,
    createdAt: new Date()
  }

  const { insertedId } = await db
    .collection<WorkingPlace>('workingPlaces')
    .insertOne(workingPlace)
  return { ...workingPlace, _id: insertedId }
}

// Updates a working place by ID, including updating the image
export async function updateWorkingPlaceById(
  db: Db,
  id: string,
  data: Partial<WorkingPlace>
): Promise<WorkingPlace | null> {
  return db
    .collection<WorkingPlace>('workingPlaces')
    .findOneAndUpdate(
      { _id: new ObjectId(id) },
      { $set: data },
      { returnDocument: 'after' }
    )
    .then(result => result.value || null)
}

// Deletes a working place by ID
export async function deleteWorkingPlaceById(
  db: Db,
  id: string
): Promise<boolean> {
  const result = await db
    .collection('workingPlaces')
    .deleteOne({ _id: new ObjectId(id) })
  return result.deletedCount === 1
}
