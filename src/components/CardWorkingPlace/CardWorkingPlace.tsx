import clsx from 'clsx'
import Link from 'next/link'
import styles from './CardWorkingPlace.module.css'
import { User, WorkingPlace } from '@/api-lib/types'
import { LuFileEdit, LuTrash2 } from 'react-icons/lu'
import { LoadingDots } from '../LoadingDots'
import { Avatar } from '../Avatar'
import { ActivityIndicator } from '../Indicator'

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
          <div className='flex space-x-4 items-start'>
            <Avatar size={80} url={place.image} username={place.name} />
            <div className='flex-1'>
              <div className='flex justify-between items-center'>
                <p className='username'>{place.displayName}</p>
                <div className='flex items-center space-x-1'>
                  {isLoading ? (
                    <LoadingDots />
                  ) : (
                    <>
                      {currentUser.isAdmin && (
                        <>
                          <button
                            onClick={handleEditClick}
                            className={styles.editButton}
                          >
                            <LuFileEdit />
                          </button>
                          <button
                            onClick={handleDeleteClick}
                            className={styles.deleteButton}
                          >
                            <LuTrash2 />
                          </button>
                        </>
                      )}
                    </>
                  )}
                </div>
              </div>
              <p className={styles.meta}>{place.pcName}</p>
              <p className={styles.meta}>
                <ActivityIndicator
                  isActive={place.isActive}
                  label={place.isActive ? 'aktiv' : 'inaktiv'}
                />
              </p>
            </div>
          </div>
        </Link>
      )}
    </div>
  )
}

export default CardUser
