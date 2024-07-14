import styles from './CardUser.module.css'
import { User } from '@/api-lib/types'
import { capitalizeString } from '@/lib/user'

interface FavouritePlacesProps {
  user: User
}

const FavouritePlaces: React.FC<FavouritePlacesProps> = ({ user }) => {
  return (
    <p className={styles.meta}>
      {user.favouritePlaces && user.favouritePlaces.length > 0 ? (
        (() => {
          const validPlaces = user.favouritePlaces.filter(p => p.trim() !== '')
          return validPlaces.length > 0 ? (
            <span>
              Lieblingsplätze:{' '}
              {validPlaces.map((p, i) => (
                <span className='italic' key={i}>
                  {capitalizeString(p)}
                  {i < validPlaces.length - 1 && ', '}
                </span>
              ))}
            </span>
          ) : (
            <p>&nbsp;</p> // Empty line
          )
        })()
      ) : (
        <p>&nbsp;</p> // Empty line
      )}
    </p>
  )
}

export default FavouritePlaces
