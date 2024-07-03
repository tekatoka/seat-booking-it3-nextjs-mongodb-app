import { Button } from '@/components/Button'
import { ButtonLink } from '@/components/Button/Button'
import { Input } from '@/components/Input'
import { Spacer, Wrapper } from '@/components/Layout'
import { Text } from '@/components/Text'
import { fetcher } from '@/lib/fetch'
import { useCallback, useRef, useState, FormEvent } from 'react'
import toast from 'react-hot-toast'
import styles from './ForgetPassword.module.css'

const ForgetPasswordIndex: React.FC = () => {
  const emailRef = useRef<HTMLInputElement>(null)
  const [status, setStatus] = useState<'loading' | 'success' | undefined>(
    undefined
  )
  const [email, setEmail] = useState<string>('')

  const onSubmit = useCallback(async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    try {
      setStatus('loading')
      await fetcher('/api/user/password/reset', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: emailRef.current?.value
        })
      })
      setEmail(emailRef.current?.value || '')
      setStatus('success')
    } catch (e: any) {
      toast.error(e.message)
      setStatus(undefined)
    }
  }, [])

  return (
    <Wrapper className={styles.root}>
      <div className={styles.main}>
        {status === 'success' ? (
          <>
            <h1 className={styles.title}>Check your inbox</h1>
            <p className={styles.subtitle}>
              An email has been sent to{' '}
              <Text as='span' color='link'>
                {email}
              </Text>
              . Please follow the link in that email to reset your password.
            </p>
          </>
        ) : (
          <>
            <h1 className={styles.title}>Forget Password</h1>
            <p className={styles.subtitle}>
              Enter the email address associated with your account, and
              we&apos;ll send you a link to reset your password.
            </p>
            <Spacer size={1} />
            <form onSubmit={onSubmit}>
              <Input
                ref={emailRef}
                htmlType='email'
                autoComplete='email'
                placeholder='Email Address'
                ariaLabel='Email Address'
                size='large'
                required
              />
              <Spacer size={0.5} axis='vertical' />
              <Button
                className={styles.submit}
                type='submit'
                size='large'
                loading={status === 'loading'}
              >
                Continue
              </Button>
            </form>
          </>
        )}
        <Spacer size={0.25} axis='vertical' />
        <ButtonLink href='/login' type='success' size='large' variant='ghost'>
          Return to login
        </ButtonLink>
      </div>
    </Wrapper>
  )
}

export default ForgetPasswordIndex
