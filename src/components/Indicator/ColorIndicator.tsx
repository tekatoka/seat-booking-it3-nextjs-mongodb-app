import styles from './ActivityIndicator.module.css'
import { FaCircle } from 'react-icons/fa'

interface ColorIndicatorProps {
  label?: string
  color: string
  size: 'large' | 'small'
  style?: any
}

const ColorIndicator: React.FC<ColorIndicatorProps> = ({
  label,
  color,
  size,
  style
}) => {
  return (
    <div className={styles.root} style={style && style}>
      <label className={styles.label}>
        <FaCircle style={{ color: color }} size={size == 'large' ? 18 : 10} />
        {label && <span className={styles.textLabel}>{label}</span>}
      </label>
    </div>
  )
}

export default ColorIndicator
