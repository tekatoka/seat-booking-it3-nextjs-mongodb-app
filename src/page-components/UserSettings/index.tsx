import { Button } from '@/components/Button'
import { Input } from '@/components/Input'
import { Spacer } from '@/components/Layout'
import Wrapper from '@/components/Layout/Wrapper'
import { fetcher } from '@/lib/fetch'
import { useCurrentUser } from '@/lib/user'
import { useRouter } from 'next/router'
import { useCallback, useEffect, useRef, useState, FormEvent } from 'react'
import toast from 'react-hot-toast'
import styles from './UserSettings.module.css'
import { EditUser } from '../Settings/EditUser/EditUser'
import { useWorkingPlaces } from '@/lib/workingPlace'
import { LuEye, LuEyeOff } from 'react-icons/lu'

const Auth: React.FC = () => {
  const oldPasswordRef = useRef<HTMLInputElement>(null)
  const newPasswordRef = useRef<HTMLInputElement>(null)
  const confirmPasswordRef = useRef<HTMLInputElement>(null)

  const [isLoading, setIsLoading] = useState(false)
  const [showOldPassword, setShowOldPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const togglePasswordVisibility = (field: string) => {
    if (field === 'old') setShowOldPassword(!showOldPassword)
    if (field === 'new') setShowNewPassword(!showNewPassword)
    if (field === 'confirm') setShowConfirmPassword(!showConfirmPassword)
  }

  const handleKeyDown = (
    event: React.KeyboardEvent<HTMLSpanElement>,
    field: string
  ) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      togglePasswordVisibility(field)
    }
  }

  const onSubmit = useCallback(async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (newPasswordRef.current?.value !== confirmPasswordRef.current?.value) {
      toast.error('Die Passwörter stimmen nicht überein')
      return
    }
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
      toast.success('Dein Passwort wurde aktualisiert!')
    } catch (e: any) {
      toast.error(e.message)
    } finally {
      setIsLoading(false)
      if (oldPasswordRef.current) oldPasswordRef.current.value = ''
      if (newPasswordRef.current) newPasswordRef.current.value = ''
      if (confirmPasswordRef.current) confirmPasswordRef.current.value = ''
    }
  }, [])

  return (
    <section className={styles.card}>
      <h4 className={styles.sectionTitle}>Passwort</h4>
      <form onSubmit={onSubmit}>
        <div className={styles.inputWithIcon}>
          <Input
            htmlType={showOldPassword ? 'text' : 'password'}
            autoComplete='current-password'
            ref={oldPasswordRef}
            label='Altes Passwort'
          />
          <span
            className={styles.eyeIcon}
            onClick={() => togglePasswordVisibility('old')}
            onKeyDown={e => handleKeyDown(e, 'old')}
            role='button'
            tabIndex={0}
            aria-label='Toggle old password visibility'
          >
            {showOldPassword ? <LuEyeOff /> : <LuEye />}
          </span>
        </div>
        <Spacer size={0.5} axis='vertical' />
        <div className={styles.inputWithIcon}>
          <Input
            htmlType={showNewPassword ? 'text' : 'password'}
            autoComplete='new-password'
            ref={newPasswordRef}
            label='Neues Passwort'
          />
          <span
            className={styles.eyeIcon}
            onClick={() => togglePasswordVisibility('new')}
            onKeyDown={e => handleKeyDown(e, 'new')}
            role='button'
            tabIndex={0}
            aria-label='Toggle new password visibility'
          >
            {showNewPassword ? <LuEyeOff /> : <LuEye />}
          </span>
        </div>
        <Spacer size={0.5} axis='vertical' />
        <div className={styles.inputWithIcon}>
          <Input
            htmlType={showConfirmPassword ? 'text' : 'password'}
            autoComplete='new-password'
            ref={confirmPasswordRef}
            label='Neues Passwort bestätigen'
          />
          <span
            className={styles.eyeIcon}
            onClick={() => togglePasswordVisibility('confirm')}
            onKeyDown={e => handleKeyDown(e, 'confirm')}
            role='button'
            tabIndex={0}
            aria-label='Toggle confirm password visibility'
          >
            {showConfirmPassword ? <LuEyeOff /> : <LuEye />}
          </span>
        </div>
        <Spacer size={0.5} axis='vertical' />
        <Button
          className={styles.submit}
          type='submit'
          variant='primary'
          loading={isLoading}
        >
          Neues Passwort setzen
        </Button>
      </form>
    </section>
  )
}

export const UserSettings: React.FC = () => {
  const { data, error, mutate } = useCurrentUser()
  const { data: workingPlacesData, mutate: workingPlacesMutate } =
    useWorkingPlaces()
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
          <EditUser
            currentUser={data.user}
            user={data.user}
            mutate={mutate}
            workingPlaces={workingPlacesData?.workingPlaces}
          />
          <Auth />
        </>
      ) : null}
    </Wrapper>
  )
}
