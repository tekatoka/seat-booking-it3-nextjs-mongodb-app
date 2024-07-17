import styles from './CardUser.module.css'
import { User } from '@/api-lib/types'

interface HomeOfficeDaysProps {
  user: User
}

const HomeOfficeDays: React.FC<HomeOfficeDaysProps> = ({ user }) => {
  return (
    <p className={styles.meta}>
      {user.homeOfficeDays && user.homeOfficeDays.length > 0 ? (
        (() => {
          const count = user.homeOfficeDays.length
          return (
            <>
              MA-Tage:{' '}
              {user.homeOfficeDays.map((day, i) => {
                return (
                  <span className='italic' key={i}>
                    {day}
                    {i < count - 1 && ', '}
                  </span>
                )
              })}
            </>
          )
        })()
      ) : (
        <p>MA-Tage: n/a</p>
      )}
    </p>
  )
}

export default HomeOfficeDays
