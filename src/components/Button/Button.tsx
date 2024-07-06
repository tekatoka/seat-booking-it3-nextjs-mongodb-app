import { LoadingDots } from '@/components/LoadingDots'
import clsx from 'clsx'
import React, { forwardRef } from 'react'
import styles from './Button.module.css'

type ButtonProps = {
  children: React.ReactNode
  type?: 'button' | 'submit' | 'reset'
  className?: string
  onClick?: React.MouseEventHandler<HTMLButtonElement>
  size?: 'small' | 'medium' | 'large' | 'icon'
  variant?: 'invert' | 'primary' | 'secondary' | 'ghost'
  loading?: boolean
  disabled?: boolean
  icon?: JSX.Element
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  function Button(
    {
      children,
      type = 'button',
      className,
      onClick,
      size,
      variant = 'invert',
      loading = false,
      disabled = false,
      icon
    },
    ref
  ) {
    return (
      <button
        className={clsx(
          styles.button,
          type && styles[type],
          size && styles[size],
          styles[variant],
          className
        )}
        type={type}
        ref={ref}
        onClick={onClick}
        disabled={loading || disabled}
      >
        {loading && <LoadingDots className={styles.loading} />}
        <span>
          <>
            {icon ? icon : ''}
            {children}
          </>
        </span>
      </button>
    )
  }
)

type ButtonLinkProps = {
  children: React.ReactNode
  type?: 'button' | 'submit' | 'reset' | 'success'
  className?: string
  href?: string
  onClick?: React.MouseEventHandler<HTMLAnchorElement>
  size?: 'small' | 'medium' | 'large'
  variant?: 'invert' | 'primary' | 'secondary' | 'ghost' // Add other variants as needed
  color?: any
}

export const ButtonLink = forwardRef<HTMLAnchorElement, ButtonLinkProps>(
  function ButtonLink(
    { children, type, className, href, onClick, size, variant = 'invert' },
    ref
  ) {
    return (
      <a
        className={clsx(
          styles.button,
          type && styles[type],
          size && styles[size],
          variant && styles[variant],
          className
        )}
        ref={ref}
        href={href}
        onClick={onClick}
      >
        <span>{children}</span>
      </a>
    )
  }
)
