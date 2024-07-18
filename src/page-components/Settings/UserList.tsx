import { Container, Spacer } from '@/components/Layout'
import Wrapper from '@/components/Layout/Wrapper'
import { CardUser as CardUserComponent } from '@/components/CardUser'
import styles from './UserList.module.css'
import { User, WorkingPlace } from '@/api-lib/types' // Ensure this import path is correct
import AddUser from './AddUser/AddUser'
import { EditUser } from './EditUser/EditUser'
import { useCallback, useState } from 'react'
import { Modal } from '@/components/Modal'
import toast from 'react-hot-toast'
import { LoadingDots } from '@/components/LoadingDots'

interface UserListProps {
  currentUser: User
  users: User[]
  workingPlaces: WorkingPlace[]
  mutate: any
  error: any
}

const sortUsersByUsername = (a: User, b: User) => {
  const usernameA = a.username.toLowerCase()
  const usernameB = b.username.toLowerCase()

  if (usernameA < usernameB) {
    return -1
  }
  if (usernameA > usernameB) {
    return 1
  }
  return 0
}

const UserList: React.FC<UserListProps> = ({
  users,
  mutate,
  workingPlaces,
  currentUser,
  error
}) => {
  const [isModalOpen, setModalOpen] = useState(false)
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const handleEditClick = useCallback((user: User) => {
    setSelectedUser(user)
    setModalOpen(true)
  }, [])

  const handleCloseModal = () => {
    setModalOpen(false)
  }

  const onDelete = useCallback(
    async (user: User) => {
      try {
        setIsLoading(true)

        if (user._id == currentUser._id) {
          toast.error('Du kannst dich nicht selbst löschen!')
          return
        }

        // Check if the user to be deleted is the last admin
        const admins = users.filter(u => u.isAdmin)
        if (user.isAdmin && admins.length === 1) {
          toast.error(
            `Der Benutzer ${user.username} kann nicht gelöscht werden, da er der letzte Administrator ist.`
          )
          return
        }
        const response = await fetch(`/api/users/${user._id}`, {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' }
        })

        if (!response.ok) {
          const errorData = await response.json()
          throw new Error(errorData.error || 'Irgendwas ist schief gelaufen')
        }

        toast.success(`${user.username} erfolgreich gelöscht`)
        // refresh user list
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
          <p className={styles.subtitle}>Benutzer</p>
          <div className={styles.separator} />
        </Container>
        {!users && !error && <LoadingDots />}
        {users?.sort(sortUsersByUsername).map((user, i) => (
          <div className={styles.wrap} key={i}>
            <CardUserComponent
              className={styles.post}
              currentUser={currentUser}
              user={user}
              handleEditClick={() => handleEditClick(user)}
              handleDeleteClick={() => onDelete(user)}
              isLoading={isLoading}
            />
          </div>
        ))}
        {selectedUser && (
          <Modal isOpen={isModalOpen} onClose={handleCloseModal}>
            <EditUser
              currentUser={currentUser}
              user={selectedUser}
              mutate={mutate}
              workingPlaces={workingPlaces}
              handleCloseModal={handleCloseModal}
            />
          </Modal>
        )}
        {!error && currentUser.isAdmin && <AddUser />}
      </Wrapper>
    </div>
  )
}

export default UserList
