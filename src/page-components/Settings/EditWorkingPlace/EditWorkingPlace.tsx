import { WorkingPlace } from '@/api-lib/types'
import { Avatar } from '@/components/Avatar'
import { Button } from '@/components/Button'
import { Spacer } from '@/components/Layout'
import { Input } from '@/components/Input'
import { FormEvent, useCallback, useEffect, useRef, useState } from 'react'
import toast from 'react-hot-toast'
import 'react-datepicker/dist/react-datepicker.css'
import styles from './EditWorkingPlace.module.css'
import { capitalizeString } from '@/lib/user'

interface EditWorkingPlaceProps {
  workingPlace: WorkingPlace
  mutate: any
  handleCloseModal: () => void
}

export const EditWorkingPlace: React.FC<EditWorkingPlaceProps> = ({
  workingPlace,
  mutate,
  handleCloseModal
}) => {
  const placenameRef = useRef<HTMLInputElement>(null)
  const pcnameRef = useRef<HTMLInputElement>(null)
  const imageRef = useRef<HTMLInputElement>(null)

  const [imageHref, setImageHref] = useState(workingPlace.image)

  const onImageChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.currentTarget.files?.[0]
      if (!file) return
      const reader = new FileReader()
      reader.onload = (l: ProgressEvent<FileReader>) => {
        if (l.target?.result) {
          setImageHref(l.target.result as string)
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
        if (placenameRef.current) {
          formData.append('name', placenameRef.current.value?.toLowerCase())
          formData.append(
            'displayName',
            capitalizeString(placenameRef.current.value)
          )
        }

        if (pcnameRef.current)
          formData.append('pcName', pcnameRef.current.value)
        if (
          imageRef.current &&
          imageRef.current.files &&
          imageRef.current.files[0]
        ) {
          formData.append('image', imageRef.current.files[0])
        }

        // Ensure the correct URL is used with the workingPlaceId
        const response = await fetch(`/api/workingPlaces/${workingPlace._id}`, {
          method: 'PATCH',
          body: formData
        })

        if (!response.ok) {
          const errorData = await response.json()
          console.log(errorData.error)
          throw new Error(errorData.error || 'Irgendwas ist schief gelaufen...')
        }

        mutate()
        toast.success(`${workingPlace.displayName} erfolgreich aktualisiert`)
        handleCloseModal()
      } catch (e: any) {
        toast.error(e.message)
      } finally {
        setIsLoading(false)
      }
    },
    [mutate, workingPlace._id]
  )

  useEffect(() => {
    if (placenameRef.current)
      placenameRef.current.value = capitalizeString(workingPlace.name)
    if (pcnameRef.current) pcnameRef.current.value = workingPlace.pcName
    if (imageRef.current) imageRef.current.value = ''
    setImageHref(workingPlace.image)
  }, [workingPlace])

  return (
    <section className={styles.card}>
      <h4 className={styles.sectionTitle}>Arbeitsplatzinfo</h4>
      <form onSubmit={onSubmit}>
        <Input ref={placenameRef} label='Bezeichnung' />
        <Spacer size={0.5} axis='vertical' />
        <Input ref={pcnameRef} label='PC Name' />
        <Spacer size={0.5} axis='vertical' />
        <span className={styles.label}>Bild</span>
        <div className={styles.avatar}>
          <Avatar size={96} username={workingPlace.name} url={imageHref} />
          <input
            aria-label='Bild'
            type='file'
            accept='image/*'
            ref={imageRef}
            onChange={onImageChange}
            style={{ display: 'block', zIndex: 10 }}
          />
        </div>
        <Spacer size={0.5} axis='vertical' />
        <div className={styles.seperator} />
        <Button
          className={styles.submit}
          type='submit'
          variant='primary'
          loading={isLoading}
        >
          Speichern
        </Button>
      </form>
    </section>
  )
}
