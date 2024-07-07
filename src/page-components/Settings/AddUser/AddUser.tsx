import { Avatar } from '@/components/Avatar'
import { Button } from '@/components/Button'
import { Input } from '@/components/Input'
import { Container, Wrapper } from '@/components/Layout'
import { LoadingDots } from '@/components/LoadingDots'
import { fetcher } from '@/lib/fetch'
import { useCurrentUser, useUsers } from '@/lib/user'
import { User } from '@/api-lib/types'
import { useCallback, useRef, useState, FormEvent } from 'react'
import toast from 'react-hot-toast'
import styles from './AddUser.module.css'

const startPassword = 'password123'

const AddUserInner: React.FC = () => {
  const usernameRef = useRef<HTMLInputElement>(null)
  const [isLoading, setIsLoading] = useState(false)

  const { mutate } = useUsers()

  const onSubmit = useCallback(
    async (e: FormEvent<HTMLFormElement>) => {
      e.preventDefault()
      try {
        setIsLoading(true)
        await fetcher('/api/users', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            username: usernameRef.current?.value,
            password: startPassword,
            isAdmin: false
          })
        })

        toast.success('Benutzer erfolgreich gespeichert')
        if (usernameRef.current) {
          usernameRef.current.value = ''
        }
        // refresh user list
        mutate()
      } catch (e: any) {
        toast.error(e.message)
      } finally {
        setIsLoading(false)
      }
    },
    [mutate]
  )

  return (
    <form onSubmit={onSubmit}>
      <Container>
        <div className={styles.form}>
          <Input
            ref={usernameRef}
            className={styles.input}
            placeholder={`Benutzername`}
          />
          <p className={styles.meta}>
            Initialpasswort: <strong>password123</strong>
          </p>
        </div>
        <Button type='submit' loading={isLoading}>
          Speichern
        </Button>
      </Container>
    </form>
  )
}

const AddUser: React.FC = () => {
  const { data, error } = useUsers()
  const loading = !data && !error

  return (
    <div className={styles.root}>
      <h3 className={styles.heading}>Benutzer hinzufügen</h3>
      {loading ? <LoadingDots>Loading</LoadingDots> : <AddUserInner />}
    </div>
  )
}

export default AddUser
