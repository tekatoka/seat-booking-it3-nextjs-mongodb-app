import clsx from 'clsx'
import styles from './Container.module.css'
import { CSSProperties, ReactNode } from 'react'

type ContainerProps = {
  justifyContent?: CSSProperties['justifyContent']
  flex?: CSSProperties['flex']
  alignItems?: CSSProperties['alignItems']
  column?: boolean
  className?: string
  children: ReactNode
}

const Container: React.FC<ContainerProps> = ({
  justifyContent,
  flex,
  alignItems,
  column,
  className,
  children
}) => {
  return (
    <div
      className={clsx(styles.container, column && styles.column, className)}
      style={{
        justifyContent,
        flex,
        alignItems
      }}
    >
      {children}
    </div>
  )
}

export default Container
