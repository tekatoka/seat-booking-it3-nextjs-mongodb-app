import { Avatar } from '@/components/Avatar'
import { Button } from '@/components/Button'
import { Input, Textarea } from '@/components/Input'
import { Container, Spacer } from '@/components/Layout'
import Wrapper from '@/components/Layout/Wrapper'
import { fetcher } from '@/lib/fetch'
import { useCurrentUser } from '@/lib/user'
import { useRouter } from 'next/router'
import { useCallback, useEffect, useRef, useState, FormEvent } from 'react'
import toast from 'react-hot-toast'
import styles from './UserSettings.module.css'
import { User } from '@/api-lib/types'
import { EditUser } from '../Settings/EditUser/EditUser'

const Auth: React.FC = () => {
  const oldPasswordRef = useRef<HTMLInputElement>(null)
  const newPasswordRef = useRef<HTMLInputElement>(null)

  const [isLoading, setIsLoading] = useState(false)

  const onSubmit = useCallback(async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    try {
      setIsLoading(true)
      await fetcher('/api/user/password', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          oldPassword: oldPasswordRef.current?.value,
          newPassword: newPasswordRef.current?.value
        })
      })
      toast.success('Your password has been updated')
    } catch (e: any) {
      toast.error(e.message)
    } finally {
      setIsLoading(false)
      if (oldPasswordRef.current) oldPasswordRef.current.value = ''
      if (newPasswordRef.current) newPasswordRef.current.value = ''
    }
  }, [])

  return (
    <section className={styles.card}>
      <h4 className={styles.sectionTitle}>Password</h4>
      <form onSubmit={onSubmit}>
        <Input
          htmlType='password'
          autoComplete='current-password'
          ref={oldPasswordRef}
          label='Old Password'
        />
        <Spacer size={0.5} axis='vertical' />
        <Input
          htmlType='password'
          autoComplete='new-password'
          ref={newPasswordRef}
          label='New Password'
        />
        <Spacer size={0.5} axis='vertical' />
        <Button
          className={styles.submit}
          type='submit'
          variant='primary'
          loading={isLoading}
        >
          Save
        </Button>
      </form>
    </section>
  )
}

export const UserSettings: React.FC = () => {
  const { data, error, mutate } = useCurrentUser()
  const router = useRouter()
  useEffect(() => {
    if (!data && !error) return
    if (!data?.user) {
      router.replace('/login')
    }
  }, [router, data, error])

  return (
    <Wrapper className={styles.wrapper}>
      <Spacer size={2} axis='vertical' />
      {data?.user ? (
        <>
          <EditUser user={data.user} mutate={mutate} />
          <Auth />
        </>
      ) : null}
    </Wrapper>
  )
}
