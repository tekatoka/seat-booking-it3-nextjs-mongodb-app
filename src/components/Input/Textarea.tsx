import clsx from 'clsx'
import { forwardRef } from 'react'
import styles from './Input.module.css'

interface TextareaProps {
  label?: string
  placeholder?: string
  className?: string
  autoComplete?: string
  ariaLabel?: string
  required?: boolean
}

const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  function Textarea(
    { label, placeholder, className, autoComplete, ariaLabel, required },
    ref
  ) {
    return (
      <div className={clsx(styles.root, className)}>
        <label>
          {label && <div className={styles.label}>{label}</div>}
          <textarea
            autoComplete={autoComplete}
            placeholder={placeholder}
            ref={ref}
            className={clsx(styles.textarea)}
            aria-label={ariaLabel}
            required={required}
          />
        </label>
      </div>
    )
  }
)

export default Textarea
