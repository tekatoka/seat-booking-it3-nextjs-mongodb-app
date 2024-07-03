import clsx from 'clsx'
import { forwardRef, ReactNode, ElementType, CSSProperties } from 'react'
import styles from './Text.module.css'

interface TextProps {
  color?: string
  children: ReactNode
  className?: string
  as?: ElementType
  [key: string]: any
}

export const Text = forwardRef<HTMLElement, TextProps>(function Text(
  { color, children, className, as: Component = 'p', ...props },
  ref
) {
  const style: CSSProperties = color
    ? ({ '--color': `var(--${color})` } as CSSProperties)
    : {}

  return (
    <Component
      style={style}
      className={clsx(styles.text, className)}
      {...props}
      ref={ref}
    >
      {children}
    </Component>
  )
})

interface TextLinkProps {
  color?: string
  children: ReactNode
  className?: string
  href: string
  onClick?: () => void
  variant?: string
}

export const TextLink = forwardRef<HTMLAnchorElement, TextLinkProps>(
  function TextLink(
    { color, children, className, href, onClick, variant },
    ref
  ) {
    const style: CSSProperties = color
      ? ({ '--color': `var(--${color})` } as CSSProperties)
      : {}

    return (
      <a
        style={style}
        className={clsx(
          styles.text,
          styles.link,
          variant && styles[variant],
          className
        )}
        href={href}
        ref={ref}
        onClick={onClick}
      >
        {children}
      </a>
    )
  }
)
