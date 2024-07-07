import { FC, useEffect } from 'react'
import { UserSettings } from '@/page-components/UserSettings'
import Head from 'next/head'
import { Settings } from '@/page-components/Settings'
import { useCurrentUser } from '@/lib/user'
import { useRouter } from 'next/router'

const SettingsPage: FC = () => {
  const { data, error } = useCurrentUser()
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
      <Settings currentUser={data.user} />
    </>
  )
}

export default SettingsPage
