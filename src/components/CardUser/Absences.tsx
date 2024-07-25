import styles from './CardUser.module.css'
import { User } from '@/api-lib/types'
import { capitalizeString } from '@/lib/user'
import { formatDate, formatShortDate } from '@/lib/default'

interface AbsencesProps {
  user: User
}

const Absences: React.FC<AbsencesProps> = ({ user }) => {
  const absences = user.absences?.filter(a => a.type == 'default')
  return (
    <p className={styles.meta}>
      {absences && absences.length > 0 ? (
        (() => {
          const count = absences.length
          return (
            <div>
              Abwesend:{' '}
              {absences?.map((absence, i) => {
                const fromDate = new Date(absence.from)
                const tillDate = absence.till ? new Date(absence.till) : null
                const fromFormatted = formatDate(fromDate)
                const tillFormatted = tillDate ? formatDate(tillDate) : 'n/a'
                const fromShortFormatted = formatShortDate(fromDate)
                const tillShortFormatted = tillDate
                  ? formatShortDate(tillDate)
                  : 'n/a'

                return (
                  <span className='font-semibold' key={i}>
                    {tillDate && fromDate.getTime() === tillDate.getTime()
                      ? `am ${fromFormatted}`
                      : `von ${
                          fromDate.getFullYear() ===
                          (tillDate?.getFullYear() ?? fromDate.getFullYear())
                            ? `${fromShortFormatted} bis ${tillFormatted}`
                            : `${fromFormatted} bis ${tillFormatted}`
                        }`}
                    {i < count - 1 && ', '}
                  </span>
                )
              })}
            </div>
          )
        })()
      ) : (
        <p>Abwesend: n/a</p> // Empty line
      )}
    </p>
  )
}

export default Absences
