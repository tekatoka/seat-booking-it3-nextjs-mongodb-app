import { User, Absence, WorkingPlace } from '@/api-lib/types'
import { Button } from '@/components/Button'
import { Spacer } from '@/components/Layout'
import { fetcher } from '@/lib/fetch'
import { FormEvent, useCallback, useEffect, useRef, useState } from 'react'
import toast from 'react-hot-toast'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import Select from 'react-select'
import styles from './EditUser.module.css'
import { LuPlus, LuTrash2 } from 'react-icons/lu'
import { formatDateAsString, stripTime } from '@/lib/default'

interface CustomDatePickerProps {
  index: number
  date: Date | string | undefined
  field: keyof Absence
  onChange: (index: number, field: keyof Absence, date: Date | null) => void
  id: string
}

const CustomDatePicker = ({
  index,
  date,
  field,
  onChange,
  id
}: CustomDatePickerProps) => {
  const parsedDate = date ? new Date(date) : null
  return (
    <DatePicker
      selected={parsedDate}
      onChange={(date: Date | null) => onChange(index, field, date)}
      dateFormat='dd.MM.yyyy'
      className='ml-1'
      placeholderText={formatDateAsString(new Date())}
      id={id}
    />
  )
}

interface EditUserProps {
  user: User
  mutate: any
  workingPlaces: WorkingPlace[]
}

export const EditUser: React.FC<EditUserProps> = ({
  user,
  workingPlaces,
  mutate
}) => {
  const usernameRef = useRef<HTMLInputElement>(null)
  const nameRef = useRef<HTMLInputElement>(null)
  const profilePictureRef = useRef<HTMLInputElement>(null)

  const [absences, setAbsences] = useState<Absence[]>([])
  const [favouritePlaces, setFavouritePlaces] = useState<string[]>(
    user.favouritePlaces || []
  )

  useEffect(() => {
    const today = stripTime(new Date())
    const filteredAndSortedAbsences = (user.absences || [])
      .filter(absence => {
        const tillDate = absence.till ? new Date(absence.till) : null
        return !tillDate || tillDate >= today
      })
      .sort((a, b) => new Date(a.from).getTime() - new Date(b.from).getTime())

    setAbsences(filteredAndSortedAbsences)
  }, [user.absences])

  const [isLoading, setIsLoading] = useState(false)

  const validateAbsences = (absences: Absence[]) => {
    for (const absence of absences) {
      const from = new Date(absence.from)
      const till = absence.till ? new Date(absence.till) : null
      if (till && from > till) {
        toast.error(
          'Das Enddatum der Abwesenheit darf nicht vor dem Startdatum liegen.'
        )
        return false
      }
    }
    return true
  }

  const onSubmit = useCallback(
    async (e: FormEvent<HTMLFormElement>) => {
      e.preventDefault()

      // Validate absences before submitting
      if (!validateAbsences(absences)) {
        return
      }

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

        // Convert absences to valid date strings
        const validAbsences = absences?.map(absence => {
          const fromDate = new Date(absence.from)
          const tillDate = absence.till ? new Date(absence.till) : null

          // Check if dates are valid
          if (
            isNaN(fromDate.getTime()) ||
            (tillDate && isNaN(tillDate.getTime()))
          ) {
            throw new Error('Invalid date format')
          }

          return {
            from: fromDate.toISOString(),
            till: tillDate ? tillDate.toISOString() : null
          }
        })

        formData.append('absences', JSON.stringify(validAbsences))
        formData.append('favouritePlaces', JSON.stringify(favouritePlaces))

        const response = await fetcher('/api/user', {
          method: 'PATCH',
          body: formData
        })
        mutate()
        toast.success('Der Benutzer wurde erfolgreich aktualisiert')
      } catch (e: any) {
        toast.error(e.message)
      } finally {
        setIsLoading(false)
      }
    },
    [mutate, absences, favouritePlaces, user._id]
  )

  const handleAbsenceChange = (
    index: number,
    field: keyof Absence,
    date: Date | null
  ) => {
    const updatedAbsences = [...absences]
    updatedAbsences[index] = {
      ...updatedAbsences[index],
      [field]: date || new Date()
    }

    // Validation: Check if "till" date is earlier than "from" date
    const { from, till } = updatedAbsences[index]
    const fromDate = new Date(from)
    const tillDate = till ? new Date(till) : null
    if (field === 'till' && tillDate && fromDate > tillDate) {
      toast.error(
        'Das Enddatum der Abwesenheit darf nicht vor dem Startdatum liegen.'
      )
      return
    }

    setAbsences(updatedAbsences)
  }

  const addAbsence = () => {
    setAbsences([...absences, { from: stripTime(new Date()) }])
  }

  const removeAbsence = (index: number) => {
    const updatedAbsences = absences.filter((_, i) => i !== index)
    setAbsences(updatedAbsences)
  }

  const handleFavouritePlaceChange = (index: number, selectedOption: any) => {
    const updatedFavouritePlaces = [...favouritePlaces]
    if (selectedOption) {
      updatedFavouritePlaces[index] = selectedOption.value
    } else {
      updatedFavouritePlaces[index] = ''
    }
    setFavouritePlaces(updatedFavouritePlaces)
  }

  const workingPlaceOptions = workingPlaces?.map(wp => ({
    value: wp.name,
    label: wp.displayName
  }))

  return (
    <section className={styles.card}>
      <h4 className={styles.sectionTitle}>{user.username}</h4>
      <span className={styles.label}>Einstellungen</span>
      <Spacer size={1} axis='vertical' />
      <form onSubmit={onSubmit}>
        <span className={styles.label}>Lieblingsplätze</span>
        <div className='my-4 space-y-4 max-w-full'>
          <Select
            options={workingPlaceOptions}
            value={workingPlaceOptions.find(
              option => option.value === favouritePlaces[0]
            )}
            onChange={option => handleFavouritePlaceChange(0, option)}
            placeholder='1. Lieblingsplatz'
            isClearable
          />
          <Select
            options={workingPlaceOptions.filter(
              option => option.value !== favouritePlaces[0]
            )}
            value={workingPlaceOptions.find(
              option => option.value === favouritePlaces[1]
            )}
            onChange={option => handleFavouritePlaceChange(1, option)}
            placeholder='2. Lieblingsplatz'
            isClearable
          />
        </div>
        <Spacer size={1.5} axis='vertical' />
        <span className={styles.label}>Abwesenheiten</span>
        <div className='my-4 space-y-4 max-w-full'>
          {absences?.map((absence, index) => (
            <div
              key={index}
              className='flex flex-col sm:flex-row sm:justify-between items-start space-y-2 sm:space-y-0 sm:space-x-4 border-b border-gray-300 pb-2 max-w-full'
            >
              <div className='flex flex-col sm:flex-row items-center sm:space-x-4 w-full'>
                <div className='flex items-center space-x-2 w-full sm:w-auto'>
                  <label
                    htmlFor={`from-${index}`}
                    className='text-sm sm:text-base'
                  >
                    von:
                  </label>
                  <div className='flex-1 min-w-[150px]'>
                    <CustomDatePicker
                      index={index}
                      date={absence.from}
                      field={'from'}
                      onChange={handleAbsenceChange}
                      id={`from-${index}`}
                    />
                  </div>
                </div>
                <div className='flex items-center space-x-2 w-full sm:w-auto mt-2 sm:mt-0'>
                  <label
                    htmlFor={`till-${index}`}
                    className='text-sm sm:text-base'
                  >
                    bis:
                  </label>
                  <div className='flex-1 min-w-[150px]'>
                    <CustomDatePicker
                      index={index}
                      date={absence.till}
                      field={'till'}
                      onChange={handleAbsenceChange}
                      id={`till-${index}`}
                    />
                  </div>
                </div>
              </div>
              <div className='w-full sm:w-auto mt-2 sm:mt-0'>
                <button
                  type='button'
                  onClick={() => removeAbsence(index)}
                  className='w-full sm:w-auto flex items-center justify-center h-full px-3 py-2 border rounded-md text-gray-500 hover:text-red-500 transition-colors duration-200'
                >
                  <LuTrash2 />
                </button>
              </div>
            </div>
          ))}
        </div>

        <Button
          type='button'
          onClick={addAbsence}
          variant='invert'
          icon={<LuPlus className='inline-block' />}
        >
          <span>Abwesenheit hinzufügen</span>
        </Button>
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
