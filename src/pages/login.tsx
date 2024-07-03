import { FC } from 'react'
import { Login } from '@/page-components/Auth'
import Head from 'next/head'

const LoginPage: FC = () => {
  return (
    <>
      <Head>
        <title>Login</title>
      </Head>
      <Login />
    </>
  )
}

export default LoginPage
