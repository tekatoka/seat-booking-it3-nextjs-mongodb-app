import { Avatar } from '@/components/Avatar'
import { Button } from '@/components/Button'
import { Input, Textarea } from '@/components/Input'
import { Container, Spacer } from '@/components/Layout'
import Wrapper from '@/components/Layout/Wrapper'
import { fetcher } from '@/lib/fetch'
import { useCurrentUser, useUsers } from '@/lib/user'
import { useRouter } from 'next/router'
import { useCallback, useEffect, useRef, useState, FormEvent } from 'react'
import toast from 'react-hot-toast'
import styles from './Settings.module.css'
import { User } from '@/api-lib/types'

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

interface AboutYouProps {
  user: User
  mutate: any
}

const AboutYou: React.FC<AboutYouProps> = ({ user, mutate }) => {
  const usernameRef = useRef<HTMLInputElement>(null)
  const nameRef = useRef<HTMLInputElement>(null)
  const profilePictureRef = useRef<HTMLInputElement>(null)

  const [avatarHref, setAvatarHref] = useState(user.profilePicture)

  const onAvatarChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.currentTarget.files?.[0]
      if (!file) return
      const reader = new FileReader()
      reader.onload = (l: ProgressEvent<FileReader>) => {
        if (l.target?.result) {
          setAvatarHref(l.target.result as string)
        }
      }
      reader.readAsDataURL(file)
    },
    []
  )

  const [isLoading, setIsLoading] = useState(false)

  const onSubmit = useCallback(
    async (e: FormEvent<HTMLFormElement>) => {
      e.preventDefault()
      try {
        setIsLoading(true)
        const formData = new FormData()
        if (usernameRef.current)
          formData.append('username', usernameRef.current.value)
        if (nameRef.current) formData.append('name', nameRef.current.value)
        if (
          profilePictureRef.current &&
          profilePictureRef.current.files &&
          profilePictureRef.current.files[0]
        ) {
          formData.append('profilePicture', profilePictureRef.current.files[0])
        }
        const response = await fetcher('/api/user', {
          method: 'PATCH',
          body: formData
        })
        mutate({ user: response.user }, false)
        toast.success('Your profile has been updated')
      } catch (e: any) {
        toast.error(e.message)
      } finally {
        setIsLoading(false)
      }
    },
    [mutate]
  )

  useEffect(() => {
    if (usernameRef.current) usernameRef.current.value = user.username
    if (nameRef.current) nameRef.current.value = user.name
    if (profilePictureRef.current) profilePictureRef.current.value = ''
    setAvatarHref(user.profilePicture)
  }, [user])

  return (
    <section className={styles.card}>
      <h4 className={styles.sectionTitle}>About You</h4>
      <form onSubmit={onSubmit}>
        <Input ref={usernameRef} label='Your Username' />
        <Spacer size={0.5} axis='vertical' />
        <Input ref={nameRef} label='Your Name' />
        <Spacer size={0.5} axis='vertical' />
        <Spacer size={0.5} axis='vertical' />
        <span className={styles.label}>Your Avatar</span>
        <div className={styles.avatar}>
          <Avatar size={96} username={user.username} url={avatarHref} />
          <input
            aria-label='Your Avatar'
            type='file'
            accept='image/*'
            ref={profilePictureRef}
            onChange={onAvatarChange}
            style={{ display: 'block', zIndex: 10 }}
          />
        </div>
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

interface SettingsProps {
  user: User
}
export const Settings: React.FC<SettingsProps> = ({ user }) => {
  const { data, error, mutate } = useUsers()
  const router = useRouter()

  useEffect(() => {
    if (!data && !error) return
  }, [router, data, error])

  return (
    <Wrapper className={styles.wrapper}>
      <Spacer size={2} axis='vertical' />
      {data?.users
        ? data.users.map((user: User, i: number) => (
            <p key={i}>{user.username}</p>
          ))
        : // <>
          //   /* <AboutYou user={data.user} mutate={mutate} />
          //   <Auth /> */
          // </>
          null}
    </Wrapper>
  )
}
