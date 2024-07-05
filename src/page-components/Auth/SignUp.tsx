import { Button } from '@/components/Button'
import { Input } from '@/components/Input'
import Checkbox from '@/components/Input/Checkbox'
import { Container, Spacer, Wrapper } from '@/components/Layout'
import { TextLink } from '@/components/Text'
import { fetcher } from '@/lib/fetch'
import { useCurrentUser } from '@/lib/user'
import { useRouter } from 'next/router'
import { useCallback, useRef, useState, FormEvent } from 'react'
import toast from 'react-hot-toast'
import styles from './Auth.module.css'

const SignUp: React.FC = () => {
  const passwordRef = useRef<HTMLInputElement>(null)
  const usernameRef = useRef<HTMLInputElement>(null)
  const isAdminRef = useRef<HTMLInputElement>(null)

  const { mutate } = useCurrentUser()

  const [isLoading, setIsLoading] = useState(false)

  const router = useRouter()

  const onSubmit = useCallback(
    async (e: FormEvent<HTMLFormElement>) => {
      e.preventDefault()
      try {
        setIsLoading(true)
        const response = await fetcher('/api/users', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            username: usernameRef.current?.value,
            password: passwordRef.current?.value,
            isAdmin: isAdminRef.current?.checked
          })
        })
        mutate({ user: response.user }, false)
        toast.success('Your account has been created')
        router.replace('/')
      } catch (e: any) {
        toast.error(e.message)
      } finally {
        setIsLoading(false)
      }
    },
    [mutate, router]
  )

  return (
    <Wrapper className={styles.root}>
      <div className={styles.main}>
        <h1 className={styles.title}>Anmelden</h1>
        <form onSubmit={onSubmit}>
          <Input
            ref={usernameRef}
            autoComplete='username'
            placeholder='Username'
            ariaLabel='Username'
            size='large'
            required
          />
          <Spacer size={0.5} axis='vertical' />
          <Input
            ref={passwordRef}
            htmlType='password'
            autoComplete='new-password'
            placeholder='Password'
            ariaLabel='Password'
            size='large'
            required
          />
          <Spacer size={0.75} axis='vertical' />
          <Checkbox
            ref={isAdminRef}
            ariaLabel='isAdmin'
            label='Administrator?'
          />
          <Spacer size={1} axis='vertical' />
          <Button
            type='submit'
            className={styles.submit}
            size='large'
            loading={isLoading}
          >
            Sign up
          </Button>
        </form>
      </div>
      <div className={styles.footer}>
        <TextLink href='/login' color='link' variant='highlight'>
          Already have an account? Log in
        </TextLink>
      </div>
    </Wrapper>
  )
}

export default SignUp
