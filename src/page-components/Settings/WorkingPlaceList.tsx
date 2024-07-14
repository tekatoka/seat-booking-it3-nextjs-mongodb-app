import { Container, Spacer } from '@/components/Layout'
import Wrapper from '@/components/Layout/Wrapper'
import { CardWorkingPlace as CardWorkingPlaceComponent } from '@/components/CardWorkingPlace'
import styles from './WorkingPlaceList.module.css'
import { User, WorkingPlace } from '@/api-lib/types' // Ensure this import path is correct
// import AddWorkingPlace from './AddWorkingPlace/AddWorkingPlace'
// import { EditWorkingPlace } from './EditWorkingPlace/EditWorkingPlace'
import { useCallback, useState } from 'react'
import { Modal } from '@/components/Modal'
import { fetcher } from '@/lib/fetch'
import toast from 'react-hot-toast'
import AddWorkingPlace from './AddWorkingPlace/AddWorkingPlace'
import { LoadingDots } from '@/components/LoadingDots'
import { EditWorkingPlace } from './EditWorkingPlace/EditWorkingPlace'

interface WorkingPlaceListProps {
  workingPlaces: WorkingPlace[]
  mutate: any
  currentUser: User
  error: any
}

const sortWorkingPlacesByName = (a: WorkingPlace, b: WorkingPlace) => {
  const nameA = a.name.toLowerCase()
  const nameB = b.name.toLowerCase()

  if (nameA < nameB) {
    return -1
  }
  if (nameA > nameB) {
    return 1
  }
  return 0
}

const WorkingPlaceList: React.FC<WorkingPlaceListProps> = ({
  workingPlaces,
  mutate,
  currentUser,
  error
}) => {
  const [isModalOpen, setModalOpen] = useState(false)
  const [selectedWorkingPlace, setSelectedWorkingPlace] =
    useState<WorkingPlace | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const handleEditClick = useCallback((workingPlace: WorkingPlace) => {
    setSelectedWorkingPlace(workingPlace)
    setModalOpen(true)
  }, [])

  const handleCloseModal = () => {
    setModalOpen(false)
  }

  const onDelete = useCallback(
    async (workingPlace: WorkingPlace) => {
      try {
        setIsLoading(true)
        const response = await fetch(`/api/workingPlaces/${workingPlace._id}`, {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' }
        })

        if (!response.ok) {
          const errorData = await response.json()
          throw new Error(errorData.error || 'Irgendwas ist schief gelaufen')
        }

        toast.success(`${workingPlace.name} erfolgreich gelöscht`)
        // refresh working place list
        mutate()
      } catch (e: any) {
        toast.error(e.message || 'Irgendwas ist schief gelaufen')
      } finally {
        setIsLoading(false)
      }
    },
    [mutate]
  )

  return (
    <div className={styles.root}>
      <Spacer axis='vertical' size={1} />
      <Wrapper>
        <Container alignItems='center' className='mb-4'>
          <p className={styles.subtitle}>Arbeitsplätze</p>
          <div className={styles.seperator} />
        </Container>
        {!workingPlaces && !error && <LoadingDots />}
        {workingPlaces?.sort(sortWorkingPlacesByName).map((workingPlace, i) => (
          <div className={styles.wrap} key={i}>
            <CardWorkingPlaceComponent
              className={styles.post}
              place={workingPlace}
              handleEditClick={() => handleEditClick(workingPlace)}
              handleDeleteClick={() => onDelete(workingPlace)}
              isLoading={isLoading}
              currentUser={currentUser}
            />
          </div>
        ))}
        {selectedWorkingPlace && (
          <Modal isOpen={isModalOpen} onClose={handleCloseModal}>
            <EditWorkingPlace
              workingPlace={selectedWorkingPlace}
              mutate={mutate}
              handleCloseModal={handleCloseModal}
            />
          </Modal>
        )}
        {!error && currentUser.isAdmin && <AddWorkingPlace />}
      </Wrapper>
    </div>
  )
}

export default WorkingPlaceList
