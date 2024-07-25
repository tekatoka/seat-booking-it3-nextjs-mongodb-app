import { Button } from '@/components/Button'
import { Input } from '@/components/Input'
import { Spacer, Wrapper } from '@/components/Layout'
import { fetcher } from '@/lib/fetch'
import { capitalizeString, useCurrentUser } from '@/lib/user'
import { useRouter } from 'next/router'
import { useCallback, useEffect, useRef, useState, FormEvent } from 'react'
import toast from 'react-hot-toast'
import styles from './Auth.module.css'

const Login: React.FC = () => {
  const usernameRef = useRef<HTMLInputElement>(null)
  const passwordRef = useRef<HTMLInputElement>(null)

  const [isLoading, setIsLoading] = useState(false)

  const { data: { user } = {}, mutate, isValidating } = useCurrentUser()
  const router = useRouter()

  useEffect(() => {
    if (isValidating) return
    if (user) router.replace('/')
  }, [user, router, isValidating])

  const onSubmit = useCallback(
    async (event: FormEvent<HTMLFormElement>) => {
      setIsLoading(true)
      event.preventDefault()
      try {
        const response = await fetcher('/api/auth', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            username: usernameRef.current
              ? capitalizeString(usernameRef.current?.value)
              : '',
            password: passwordRef.current?.value
          })
        })
        mutate({ user: response.user }, false)
        toast.success('Du hast dich erfolgreich angemeldet', {
          duration: 1500
        })
      } catch (e) {
        toast.error('Name oder Passwort ist falsch')
      } finally {
        setIsLoading(false)
      }
    },
    [mutate]
  )

  return (
    <Wrapper className={styles.root}>
      <div className={styles.main}>
        <h1 className={styles.title}>Anmeldung</h1>
        <form onSubmit={onSubmit}>
          <Input
            ref={usernameRef}
            htmlType='text'
            autoComplete='text'
            placeholder='Username'
            ariaLabel='Username'
            size='large'
            required
          />
          <Spacer size={0.5} axis='vertical' />
          <Input
            ref={passwordRef}
            htmlType='password'
            autoComplete='current-password'
            placeholder='Password'
            ariaLabel='Password'
            size='large'
            required
          />
          <Spacer size={0.5} axis='vertical' />
          <Button
            className={styles.submit}
            type='submit'
            size='large'
            loading={isLoading}
          >
            Einloggen
          </Button>
          <Spacer size={0.25} axis='vertical' />
          {/* <ButtonLink
            href='/forget-password'
            type='success'
            size='large'
            variant='ghost'
          >
            Forgot password
          </ButtonLink> */}
        </form>
      </div>
      {/* <div className={styles.footer}>
        <TextLink href='/sign-up' color='link' variant='highlight'>
          Don&apos;t have an account? Sign Up
        </TextLink>
      </div> */}
    </Wrapper>
  )
}

export default Login
