import Image from 'next/image'
import styles from './Avatar.module.css'

const Avatar = ({ size, username, url }) => {
  return (
    <Image
      className={styles.avatar}
      src={url || '/images/default_user.jpg'}
      alt={username}
      width={size}
      height={size}
      layout='fixed'
    />
  )
}

export default Avatar
