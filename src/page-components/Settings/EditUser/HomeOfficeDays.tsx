import Checkbox from '@/components/Input/Checkbox'
import styles from './EditUser.module.css'

const HomeOfficeDays: React.FC<{
  selectedDays: string[]
  setSelectedDays: (days: string[]) => void
}> = ({ selectedDays, setSelectedDays }) => {
  const days = ['Mo.', 'Di.', 'Mi.', 'Do.', 'Fr.']

  const handleDayChange = (day: string) => {
    if (selectedDays.includes(day)) {
      setSelectedDays(selectedDays.filter(d => d !== day))
    } else {
      setSelectedDays([...selectedDays, day])
    }
  }

  return (
    <div>
      <span className={styles.label}>Home Office Tage</span>
      <div className='my-4 space-x-2 flex flex-wrap gap-4'>
        {days.map(day => (
          <Checkbox
            key={day}
            label={day}
            isChecked={selectedDays.includes(day)}
            onChange={() => handleDayChange(day)}
            smallLabel={true}
          />
        ))}
      </div>
    </div>
  )
}

export default HomeOfficeDays
