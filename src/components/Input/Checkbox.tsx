import clsx from 'clsx'
import { forwardRef } from 'react'
import styles from './Input.module.css'

interface CheckboxProps {
  label?: string
  isChecked?: boolean
  isRequired?: boolean
  isDisabled?: boolean
  className?: string
  ariaLabel?: string
  smallLabel?: boolean
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void
}

const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(function Checkbox(
  {
    label,
    isChecked,
    isRequired,
    isDisabled,
    className,
    ariaLabel,
    smallLabel,
    onChange
  },
  ref
) {
  return (
    <div className={clsx(styles.root, className)}>
      <label className={smallLabel ? styles.smallLabel : styles.label}>
        <input
          type='checkbox'
          checked={isChecked}
          ref={ref}
          className={styles.checkbox}
          aria-label={ariaLabel}
          required={isRequired}
          disabled={isDisabled}
          onChange={onChange}
        />
        {label && (
          <span
            className={smallLabel ? styles.smallTextLabel : styles.textLabel}
          >
            {label}
          </span>
        )}
      </label>
    </div>
  )
})

export default Checkbox
