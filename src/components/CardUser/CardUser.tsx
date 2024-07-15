import { Container } from '@/components/Layout'
import clsx from 'clsx'
import Link from 'next/link'
import styles from './CardUser.module.css'
import { User } from '@/api-lib/types'
import { LuFileEdit, LuTrash2 } from 'react-icons/lu'
import { LoadingDots } from '../LoadingDots'
import FavouritePlaces from './FavouritePlaces'
import Absences from './Absences'

interface CardUserProps {
  user: User
  className?: string
  currentUser: User
  handleEditClick: () => void
  handleDeleteClick: () => void
  isLoading: boolean
}

const CardUser: React.FC<CardUserProps> = ({
  user,
  currentUser,
  className,
  handleEditClick,
  handleDeleteClick,
  isLoading
}) => {
  return (
    <div className={clsx(styles.root, className)}>
      {user && (
        <Link href='#'>
          <Container column>
            <div className='flex justify-between items-center'>
              <p className='username'>
                {user.username} {user.isAdmin && ' (Admin)'}
              </p>
              <div className='flex justify-between items-center space-x-1'>
                {isLoading ? (
                  <LoadingDots />
                ) : (
                  <>
                    {currentUser.isAdmin ||
                    currentUser.username === user.username ? (
                      <button
                        onClick={handleEditClick}
                        className={styles.editButton}
                      >
                        <LuFileEdit />
                      </button>
                    ) : null}
                    {currentUser.isAdmin ? (
                      <button
                        onClick={handleDeleteClick}
                        className={styles.deleteButton}
                      >
                        <LuTrash2 />
                      </button>
                    ) : null}
                  </>
                )}
              </div>
            </div>
            <FavouritePlaces user={user} />
            <Absences user={user} />
          </Container>
        </Link>
      )}
    </div>
  )
}

export default CardUser
