import clsx from 'clsx'
import styles from './LoadingDots.module.css'
import React from 'react'

type LoadingDotsProps = {
  children?: React.ReactNode
  className?: string
}

const LoadingDots: React.FC<LoadingDotsProps> = ({ children, className }) => {
  return (
    <span className={clsx(styles.loading, className)}>
      {children && <div className={styles.child}>{children}</div>}
      <span />
      <span />
      <span />
    </span>
  )
}

export default LoadingDots
