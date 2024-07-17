import styles from './ActivityIndicator.module.css'
import { FaCircle } from 'react-icons/fa'

interface ActivityIndicatorProps {
  label?: string
  isActive?: boolean
}

const ActivityIndicator: React.FC<ActivityIndicatorProps> = ({
  label,
  isActive
}) => {
  return (
    <div className={styles.root}>
      <label className={styles.label}>
        <FaCircle
          className={isActive ? styles.active : styles.inactive}
          size={10}
        />
        {label && <span className={styles.textLabel}>{label}</span>}
      </label>
    </div>
  )
}

export default ActivityIndicator
