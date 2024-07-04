import { FC } from 'react'
import { UserSettings } from '@/page-components/UserSettings'
import Head from 'next/head'
import { Settings } from '@/page-components/Settings'

const SettingsPage: FC = () => {
  return (
    <>
      <Head>
        <title>Settings</title>
      </Head>
      <div className='container'>
        {/* <Container alignItems='center'>
            <p className={styles.subtitle}>Your login</p>
            <div className={styles.seperator} />
          </Container> */}
        <Settings />
      </div>
      {/* <Settings /> */}
    </>
  )
}

export default SettingsPage
