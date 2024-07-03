import clsx from 'clsx'
import styles from './Skeleton.module.css'
import { ReactNode } from 'react'

interface SkeletonProps {
  width?: string | number
  height?: string | number
  className?: string
  children?: ReactNode
  hide?: boolean
}

const Skeleton: React.FC<SkeletonProps> = ({
  width,
  height,
  className,
  children,
  hide
}) => {
  return (
    <span
      className={clsx(!hide && styles.skeleton, className)}
      style={{ width, height }}
    >
      {children}
    </span>
  )
}

export default Skeleton
