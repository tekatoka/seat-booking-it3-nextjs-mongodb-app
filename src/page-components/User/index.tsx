import styles from './User.module.css'

import UserHeader from './UserHeader'
import UserPosts from './UserPosts'
import { User as UserType } from '@/api-lib/types' // Ensure this import path is correct

interface UserProps {
  user: UserType
}

export const User: React.FC<UserProps> = ({ user }) => {
  return (
    <div className={styles.root}>
      <UserHeader user={user} />
      <UserPosts user={user} />
    </div>
  )
}

export default User
