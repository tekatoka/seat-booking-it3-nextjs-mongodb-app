import clsx from 'clsx'
import { forwardRef } from 'react'
import styles from './Input.module.css'

interface InputProps {
  label?: string
  placeholder?: string
  className?: string
  htmlType?: string
  autoComplete?: string
  size?: 'small' | 'medium' | 'large'
  ariaLabel?: string
  required?: boolean
}

const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  {
    label,
    placeholder,
    className,
    htmlType = 'text',
    autoComplete,
    size,
    ariaLabel,
    required
  },
  ref
) {
  return (
    <div className={clsx(styles.root, className)}>
      <label>
        {label && <div className={styles.label}>{label}</div>}
        <input
          type={htmlType}
          autoComplete={autoComplete}
          placeholder={placeholder}
          ref={ref}
          className={clsx(styles.input, size && styles[size])}
          aria-label={ariaLabel}
          required={required}
        />
      </label>
    </div>
  )
})

export default Input
