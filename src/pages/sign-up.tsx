import { FC } from 'react'
import { SignUp } from '@/page-components/Auth'
import Head from 'next/head'

const SignupPage: FC = () => {
  return (
    <>
      <Head>
        <title>Sign up</title>
      </Head>
      <SignUp />
    </>
  )
}

export default SignupPage
