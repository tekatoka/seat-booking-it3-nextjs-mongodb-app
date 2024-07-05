import { findUserByUsername } from '@/api-lib/db'
import { getMongoDb } from '@/api-lib/mongodb'
import { User as UserType } from '@/api-lib/types' // Ensure this import path is correct
import { UserSettings } from '@/page-components/UserSettings'
import Head from 'next/head'
import { GetServerSideProps } from 'next'

interface UserPageProps {
  user: UserType & { _id: string; createdAt: string }
}

const UserPage: React.FC<UserPageProps> = ({ user }) => {
  return (
    <>
      <Head>
        <title>
          {user.name} (@{user.username})
        </title>
      </Head>
      {/* <User user={user} /> */}
      <UserSettings />
    </>
  )
}

export const getServerSideProps: GetServerSideProps = async context => {
  const db = await getMongoDb()

  const user = await findUserByUsername(db, context.params?.username as string)
  if (!user) {
    return {
      notFound: true
    }
  }

  const transformedUser = {
    ...user,
    _id: user._id?.toString() || '',
    createdAt: user.createdAt?.toISOString() || ''
  }

  return { props: { user: transformedUser } }
}

export default UserPage
