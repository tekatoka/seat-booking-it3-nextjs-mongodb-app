import { Button } from '@/components/Button'
import { Input } from '@/components/Input'
import { Container, Spacer, Wrapper } from '@/components/Layout'
import { LoadingDots } from '@/components/LoadingDots'
import { fetcher } from '@/lib/fetch'
import { useWorkingPlaces } from '@/lib/workingPlace'
import { useCallback, useRef, useState, FormEvent } from 'react'
import toast from 'react-hot-toast'
import styles from './AddWorkingPlace.module.css'

const AddWorkingPlaceInner: React.FC = () => {
  const nameRef = useRef<HTMLInputElement>(null)
  const pcNameRef = useRef<HTMLInputElement>(null)
  const [isLoading, setIsLoading] = useState(false)

  const { mutate } = useWorkingPlaces()

  const onSubmit = useCallback(
    async (e: FormEvent<HTMLFormElement>) => {
      e.preventDefault()
      try {
        setIsLoading(true)
        await fetcher('/api/workingPlaces', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: nameRef.current?.value,
            pcName: pcNameRef.current?.value
          })
        })
        toast.success('Arbeitsplatz erfolgreich gespeichert')
        if (nameRef.current) {
          nameRef.current.value = ''
        }
        if (pcNameRef.current) {
          pcNameRef.current.value = ''
        }
        // refresh working place list
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
            ref={nameRef}
            className={styles.input}
            placeholder={`Arbeitsplatzname`}
          />
          <Spacer size={0.15} axis='vertical' />
          <Input
            ref={pcNameRef}
            className={styles.input}
            placeholder={`PC Name`}
          />
        </div>
        <Button type='submit' loading={isLoading}>
          Speichern
        </Button>
      </Container>
    </form>
  )
}

const AddWorkingPlace: React.FC = () => {
  const { data, error } = useWorkingPlaces()
  const loading = !data && !error

  return (
    <div className={styles.root}>
      <h3 className={styles.heading}>Arbeitsplatz hinzufügen</h3>
      <AddWorkingPlaceInner />
    </div>
  )
}

export default AddWorkingPlace
