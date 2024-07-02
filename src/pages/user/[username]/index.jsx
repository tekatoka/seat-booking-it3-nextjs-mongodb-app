import { findUserByUsername } from '@/api-lib/db'
import { getMongoDb } from '@/api-lib/mongodb'
import { User } from '@/page-components/User'
import Head from 'next/head'

export default function UserPage({ user }) {
  return (
    <>
      <Head>
        <title>
          {user.name} (@{user.username})
        </title>
      </Head>
      <User user={user} />
    </>
  )
}

export async function getServerSideProps(context) {
  const db = await getMongoDb()

  const user = await findUserByUsername(db, context.params.username)
  console.log(user)
  if (!user) {
    return {
      notFound: true
    }
  }
  user._id = user._id.toString()
  user.createdAt = user.createdAt?.toISOString() ?? ''

  return { props: { user } }
}
