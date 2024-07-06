import { User } from '@/api-lib/types'
import { Avatar } from '@/components/Avatar'
import { Button } from '@/components/Button'
import { Spacer } from '@/components/Layout'
import { fetcher } from '@/lib/fetch'
import { Input } from '@/components/Input'
import { FormEvent, useCallback, useEffect, useRef, useState } from 'react'
import toast from 'react-hot-toast'
import styles from './EditUser.module.css'

interface EditUserProps {
  user: User
  mutate: any
}

export const EditUser: React.FC<EditUserProps> = ({ user, mutate }) => {
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
      console.log('Form submitted') // Add console log to verify submission
      e.preventDefault()
      try {
        setIsLoading(true)
        const formData = new FormData()
        if (user._id) {
          formData.append('_id', user._id.toString())
        }
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
