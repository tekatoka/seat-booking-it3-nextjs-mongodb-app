import { Button } from '@/components/Button'
import { ButtonLink } from '@/components/Button/Button'
import { Input } from '@/components/Input'
import { Spacer, Wrapper } from '@/components/Layout'
import { fetcher } from '@/lib/fetch'
import { useCallback, useRef, useState, FormEvent } from 'react'
import toast from 'react-hot-toast'
import styles from './ForgetPassword.module.css'

interface NewPasswordProps {
  token: string
}

const NewPassword: React.FC<NewPasswordProps> = ({ token }) => {
  const passwordRef = useRef<HTMLInputElement>(null)
  const [status, setStatus] = useState<'loading' | 'success' | undefined>(
    undefined
  )

  const onSubmit = useCallback(
    async (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault()
      setStatus('loading')
      try {
        await fetcher('/api/user/password/reset', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            token,
            password: passwordRef.current?.value
          })
        })
        setStatus('success')
      } catch (e: any) {
        toast.error(e.message)
        setStatus(undefined)
      }
    },
    [token]
  )

  return (
    <div className={styles.main}>
      <h1 className={styles.title}>Reset Password</h1>
      {status === 'success' ? (
        <>
          <p className={styles.subtitle}>
            Your password has been updated successfully.
          </p>
        </>
      ) : (
        <>
          <p className={styles.subtitle}>
            Enter a new password for your account
          </p>
          <Spacer size={1} />
          <form onSubmit={onSubmit}>
            <Input
              ref={passwordRef}
              htmlType='password'
              autoComplete='new-password'
              placeholder='New Password'
              ariaLabel='New Password'
              size='large'
              required
            />
            <Spacer size={0.5} axis='vertical' />
            <Button className={styles.submit} type='submit' size='large'>
              Reset Password
            </Button>
          </form>
        </>
      )}
      <Spacer size={0.25} axis='vertical' />
      <ButtonLink href='/login' type='success' size='large' variant='ghost'>
        Return to login
      </ButtonLink>
    </div>
  )
}

const BadLink: React.FC = () => {
  return (
    <div className={styles.main}>
      <h1 className={styles.title}>Invalid Link</h1>
      <p className={styles.subtitle}>
        It looks like you may have clicked on an invalid link. Please close this
        window and try again.
      </p>
      <Spacer size={1} />
      <ButtonLink href='/login' type='success' size='large' variant='ghost'>
        Return to login
      </ButtonLink>
    </div>
  )
}

interface ForgetPasswordTokenProps {
  valid: boolean
  token: string
}

const ForgetPasswordToken: React.FC<ForgetPasswordTokenProps> = ({
  valid,
  token
}) => {
  return (
    <Wrapper className={styles.root}>
      {valid ? <NewPassword token={token} /> : <BadLink />}
    </Wrapper>
  )
}

export default ForgetPasswordToken
