import UserCalendar from './UserCalendar'
import { User } from '@/api-lib/types'
import { useUserAbsencesAndHomeOfficeDays } from '@/lib/calendar/hooks'
import { useCallback, useState } from 'react'
import { Container, Spacer, Wrapper } from '../Layout'
import styles from './Calendar.module.css'

interface CalendarComponentProps {
  userData: User[]
}

export const CalendarComponent: React.FC<CalendarComponentProps> = ({
  userData
}) => {
  const [dateRange, setDateRange] = useState<{ start: Date; end: Date }>({
    start: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
    end: new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0)
  })
  const { absences, homeOfficeDays } = useUserAbsencesAndHomeOfficeDays(
    userData,
    dateRange.start,
    dateRange.end
  )

  const handleRangeChange = useCallback((start: Date, end: Date) => {
    setDateRange({ start, end })
  }, [])

  return (
    <div>
      <Spacer axis='vertical' size={1} />
      <Wrapper>
        <Container alignItems='center' className='mb-4'>
          <p className={styles.subtitle}>Team-Kalender</p>
          <div className={styles.separator} />
        </Container>
        <UserCalendar
          absences={absences}
          homeOfficeDays={homeOfficeDays}
          onRangeChange={handleRangeChange}
          endDate={dateRange.end}
        />
      </Wrapper>
      <Spacer axis='vertical' size={2} />
    </div>
  )
}
