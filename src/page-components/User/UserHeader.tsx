import { Avatar } from '@/components/Avatar'
import { Container } from '@/components/Layout'
import styles from './UserHeader.module.css'
import { User as UserType } from '@/api-lib/types' // Ensure this import path is correct

interface UserHeaderProps {
  user: UserType
}

const UserHeader: React.FC<UserHeaderProps> = ({ user }) => {
  return (
    <Container className={styles.root} column alignItems='center'>
      <div className={styles.avatar}>
        <Avatar size={168} username={user.username} url={user.profilePicture} />
      </div>
      <h1>
        <div className={styles.name}>{user.name}</div>
        <div className={styles.username}>@{user.username}</div>
      </h1>
      <p className={styles.bio}>{user.bio}</p>
    </Container>
  )
}

export default UserHeader
