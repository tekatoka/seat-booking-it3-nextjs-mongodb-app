import { Container } from '@/components/Layout'
import clsx from 'clsx'
import Link from 'next/link'
import styles from './CardWorkingPlace.module.css'
import { User, WorkingPlace } from '@/api-lib/types'
import { LuFileEdit, LuTrash2 } from 'react-icons/lu'
import { LoadingDots } from '../LoadingDots'

interface CardWorkingPlaceProps {
  place: WorkingPlace
  className?: string
  currentUser: User
  handleEditClick: () => void
  handleDeleteClick: () => void
  isLoading: boolean
}

const CardUser: React.FC<CardWorkingPlaceProps> = ({
  place,
  currentUser,
  className,
  handleEditClick,
  handleDeleteClick,
  isLoading
}) => {
  return (
    <div className={clsx(styles.root, className)}>
      {place && (
        <Link href='#'>
          <Container column>
            <div className='flex justify-between items-center'>
              <p className='username'>{place.name}</p>
              <div className='flex justify-between items-center space-x-1'>
                {/* {isLoading ? (
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
                )} */}
              </div>
            </div>
          </Container>
        </Link>
      )}
    </div>
  )
}

export default CardUser
