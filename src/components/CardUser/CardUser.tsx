import { Container } from '@/components/Layout'
import clsx from 'clsx'
import Link from 'next/link'
import styles from './CardUser.module.css'
import { User } from '@/api-lib/types'
import { LuFileEdit } from 'react-icons/lu'

interface CardUserProps {
  user: User
  className?: string
  currentUser: User
  handleEditClick: () => void
}

const CardUser: React.FC<CardUserProps> = ({
  user,
  currentUser,
  className,
  handleEditClick
}) => {
  return (
    <div className={clsx(styles.root, className)}>
      {user && (
        <Link href='#'>
          <Container column>
            <div className='flex justify-between items-center'>
              <p className='username'>{user.username}</p>
              {currentUser.isAdmin || currentUser.username === user.username ? (
                <button onClick={handleEditClick} className='edit-button'>
                  <LuFileEdit />
                </button>
              ) : null}
            </div>
            <p className={styles.meta}>Lieblingsplätze:</p>
            <p className={styles.meta}>Abwesend:</p>
          </Container>
        </Link>
      )}
    </div>
  )
}

export default CardUser
