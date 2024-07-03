import Image from 'next/image'

import styles from './Avatar.module.css'

interface AvatarProps {
  size: number
  username: string
  url?: string
}

const Avatar: React.FC<AvatarProps> = ({ size, username, url }) => {
  return (
    <Image
      className={styles.avatar}
      src={url || '/images/default_user.jpg'}
      alt={username}
      width={size}
      height={size}
      sizes={`${size}px`}
    />
  )
}

export default Avatar
