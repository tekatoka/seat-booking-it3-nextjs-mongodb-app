import { findAndDeleteTokenByIdAndType, updateUserById } from '@/api-lib/db'
import { getMongoDb } from '@/api-lib/mongodb'
import VerifyEmail from '@/page-components/VerifyEmail'
import Head from 'next/head'
import { GetServerSideProps } from 'next'

interface EmailVerifyPageProps {
  valid: boolean
}

const EmailVerifyPage: React.FC<EmailVerifyPageProps> = ({ valid }) => {
  return (
    <>
      <Head>
        <title>Email verification</title>
      </Head>
      <VerifyEmail valid={valid} />
    </>
  )
}

export const getServerSideProps: GetServerSideProps<
  EmailVerifyPageProps
> = async context => {
  const db = await getMongoDb()

  const { token } = context.params as { token: string }

  const deletedToken = await findAndDeleteTokenByIdAndType(
    db,
    token,
    'emailVerify'
  )

  if (!deletedToken) return { props: { valid: false } }

  await updateUserById(db, deletedToken.creatorId, {
    //emailVerified: true
  })

  return { props: { valid: true } }
}

export default EmailVerifyPage
