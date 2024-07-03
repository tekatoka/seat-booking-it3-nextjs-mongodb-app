import clsx from 'clsx'
import styles from './Wrapper.module.css'
import { ReactNode } from 'react'

interface WrapperProps {
  children: ReactNode
  className?: string
}

const Wrapper: React.FC<WrapperProps> = ({ children, className }) => {
  return <div className={clsx(styles.wrapper, className)}>{children}</div>
}

export default Wrapper
