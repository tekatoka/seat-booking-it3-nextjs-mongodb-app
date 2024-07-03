import { findTokenByIdAndType } from '@/api-lib/db'
import { getMongoDb } from '@/api-lib/mongodb'
import { ForgetPasswordToken } from '@/page-components/ForgetPassword'
import Head from 'next/head'
import { GetServerSideProps } from 'next'

interface ResetPasswordTokenPageProps {
  valid: boolean
  token: string
}

const ResetPasswordTokenPage: React.FC<ResetPasswordTokenPageProps> = ({
  valid,
  token
}) => {
  return (
    <>
      <Head>
        <title>Forget password</title>
      </Head>
      <ForgetPasswordToken valid={valid} token={token} />
    </>
  )
}

export const getServerSideProps: GetServerSideProps = async context => {
  const db = await getMongoDb()

  const tokenDoc = await findTokenByIdAndType(
    db,
    context.params?.token as string,
    'passwordReset'
  )

  return { props: { token: context.params?.token, valid: !!tokenDoc } }
}

export default ResetPasswordTokenPage
