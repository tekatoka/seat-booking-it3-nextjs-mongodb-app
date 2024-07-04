import clsx from 'clsx'
import { forwardRef } from 'react'
import styles from './Input.module.css'

interface CheckboxProps {
  label?: string
  isChecked?: boolean
  isRequired?: boolean
  className?: string
  ariaLabel?: string
}

const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(function Checkbox(
  { label, isChecked, isRequired, className, ariaLabel },
  ref
) {
  return (
    <div className={clsx(styles.root, className)}>
      <label className={styles.label}>
        <input
          type='checkbox'
          checked={isChecked}
          ref={ref}
          className={styles.checkbox}
          aria-label={ariaLabel}
          required={isRequired}
        />
        {label && <span className={styles.textLabel}>{label}</span>}
      </label>
    </div>
  )
})

export default Checkbox
