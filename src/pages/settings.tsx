import { FC } from 'react'
import { Settings } from '@/page-components/Settings'
import Head from 'next/head'

const SettingsPage: FC = () => {
  return (
    <>
      <Head>
        <title>Settings</title>
      </Head>
      <Settings />
    </>
  )
}

export default SettingsPage
