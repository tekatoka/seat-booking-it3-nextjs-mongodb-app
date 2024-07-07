import { Container, Spacer } from '@/components/Layout'
import Wrapper from '@/components/Layout/Wrapper'
import { CardUser as CardUserComponent } from '@/components/CardUser'
import styles from './UserList.module.css'
import { User } from '@/api-lib/types' // Ensure this import path is correct
import AddUser from './AddUser/AddUser'
import { EditUser } from './EditUser/EditUser'
import { useCallback, useState } from 'react'
import { Modal } from '@/components/Modal'
import { fetcher } from '@/lib/fetch'
import toast from 'react-hot-toast'

interface UserListProps {
  currentUser: User
  users: User[]
  mutate: any
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

const UserList: React.FC<UserListProps> = ({ users, mutate, currentUser }) => {
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
        const response = await fetch(`/api/users/${user._id}`, {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' }
        })

        if (!response.ok) {
          const errorData = await response.json()
          throw new Error(errorData.error || 'Something went wrong')
        }

        toast.success(`${user.username} erfolgreich gelöscht`)
        // refresh user list
        mutate()
      } catch (e: any) {
        toast.error(e.message || 'Something went wrong')
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
          <div className={styles.seperator} />
        </Container>
        {users.sort(sortUsersByUsername).map((user, i) => (
          <div className={styles.wrap} key={i}>
            <CardUserComponent
              className={styles.post}
              currentUser={currentUser}
              user={user}
              handleEditClick={() => handleEditClick(user)}
              handleDeleteClick={() => onDelete(user)}
            />
          </div>
        ))}
        {selectedUser && (
          <Modal isOpen={isModalOpen} onClose={handleCloseModal}>
            <EditUser user={selectedUser} mutate={mutate} />
          </Modal>
        )}
        {currentUser.isAdmin && <AddUser />}
      </Wrapper>
    </div>
  )
}

export default UserList
