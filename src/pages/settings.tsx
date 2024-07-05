import { FC, useEffect } from 'react'
import { UserSettings } from '@/page-components/UserSettings'
import Head from 'next/head'
import { Settings } from '@/page-components/Settings'
import { useCurrentUser } from '@/lib/user'
import { useRouter } from 'next/router'

const SettingsPage: FC = () => {
  const { data, error, mutate } = useCurrentUser()
  const router = useRouter()

  useEffect(() => {
    if (!data && !error) return
    if (!data?.user) {
      router.replace('/login')
    }
  }, [router, data, error])

  if (!data?.user) {
    return null
  }

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
        <Settings user={data.user} />
      </div>
    </>
  )
}

export default SettingsPage
