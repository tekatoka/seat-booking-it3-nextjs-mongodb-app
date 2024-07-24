import React, {
  FormEvent,
  useCallback,
  useEffect,
  useRef,
  useState
} from 'react'
import { User, Absence, WorkingPlace, AbsenceType } from '@/api-lib/types'
import { Button } from '@/components/Button'
import { Spacer } from '@/components/Layout'
import { fetcher } from '@/lib/fetch'
import { toast } from 'react-hot-toast'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import Select from 'react-select'
import { SketchPicker } from 'react-color'
import { formatDateAsString, stripTime } from '@/lib/default'
import Checkbox from '@/components/Input/Checkbox'
import HomeOfficeDays from './HomeOfficeDays'
import Absences from './Absences'
import styles from './EditUser.module.css'
import { DropdownSelect } from '@/components/DropdownSelect'

interface EditUserProps {
  user: User
  currentUser: User
  mutate: any
  workingPlaces: WorkingPlace[]
  handleCloseModal?: () => void
}

export const EditUser: React.FC<EditUserProps> = ({
  user,
  currentUser,
  workingPlaces,
  mutate,
  handleCloseModal
}) => {
  const usernameRef = useRef<HTMLInputElement>(null)
  const nameRef = useRef<HTMLInputElement>(null)
  const profilePictureRef = useRef<HTMLInputElement>(null)
  const isAdminRef = useRef<HTMLInputElement>(null)

  const [absences, setAbsences] = useState<Absence[]>([])
  const [favouritePlaces, setFavouritePlaces] = useState<string[]>(
    user.favouritePlaces || []
  )
  const [homeOfficeDays, setHomeOfficeDays] = useState<string[]>(
    user.homeOfficeDays || []
  )
  const [color, setColor] = useState<string>(user.color || '#000000')
  const [displayColorPicker, setDisplayColorPicker] = useState<boolean>(false)

  useEffect(() => {
    if (user.isAdmin != null && isAdminRef.current)
      isAdminRef.current.checked = user.isAdmin
  }, [user])

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
            throw new Error('Falsches Datumsformat')
          }

          return {
            from: fromDate.toISOString(),
            till: tillDate ? tillDate.toISOString() : null,
            type: absence.type // Add the absence type
          }
        })

        formData.append('absences', JSON.stringify(validAbsences))
        formData.append('favouritePlaces', JSON.stringify(favouritePlaces))
        formData.append('homeOfficeDays', JSON.stringify(homeOfficeDays))
        formData.append('color', JSON.stringify(color))

        if (isAdminRef.current)
          formData.append(
            'isAdmin',
            JSON.stringify(isAdminRef.current?.checked)
          )

        const response = await fetcher('/api/user', {
          method: 'PATCH',
          body: formData
        })
        mutate()
        toast.success('Der Benutzer wurde erfolgreich aktualisiert')
        handleCloseModal && handleCloseModal()
      } catch (e: any) {
        toast.error(e.message)
      } finally {
        setIsLoading(false)
      }
    },
    [mutate, absences, favouritePlaces, homeOfficeDays, color, user._id]
  )

  const handleAbsenceChange = (
    index: number,
    field: keyof Absence,
    value: Date | null | AbsenceType
  ) => {
    const updatedAbsences = [...absences]
    updatedAbsences[index] = {
      ...updatedAbsences[index],
      [field]: value || new Date()
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

  const handleAbsenceTypeChange = (index: number, type: AbsenceType) => {
    const updatedAbsences = [...absences]
    updatedAbsences[index].type = type
    setAbsences(updatedAbsences)
  }

  const addAbsence = () => {
    setAbsences([...absences, { from: stripTime(new Date()), type: 'default' }])
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

  const handleColorChange = (color: any) => {
    setColor(color.hex)
  }

  return (
    <section className={styles.card}>
      <h4 className={styles.sectionTitle}>{user.username}</h4>
      <span className={styles.label}>Einstellungen</span>
      <Spacer size={1} axis='vertical' />
      <form onSubmit={onSubmit}>
        <span className={styles.label}>Lieblingsplätze</span>
        <div className='my-4 space-y-4 max-w-full'>
          <DropdownSelect
            options={workingPlaceOptions}
            onChange={option => handleFavouritePlaceChange(0, option)}
            placeholder='1. Lieblingsplatz'
            value={workingPlaceOptions.find(
              option => option.value === favouritePlaces[0]
            )}
            isClearable
          />
          <DropdownSelect
            options={workingPlaceOptions.filter(
              option => option.value !== favouritePlaces[0]
            )}
            onChange={option => handleFavouritePlaceChange(1, option)}
            placeholder='2. Lieblingsplatz'
            value={workingPlaceOptions.find(
              option => option.value === favouritePlaces[1]
            )}
            isClearable
          />
        </div>

        <Spacer size={1} axis='vertical' />
        <HomeOfficeDays
          selectedDays={homeOfficeDays}
          setSelectedDays={setHomeOfficeDays}
        />
        <div className={styles.separator} />

        <Absences
          absences={absences}
          handleAbsenceChange={handleAbsenceChange}
          handleAbsenceTypeChange={handleAbsenceTypeChange}
          addAbsence={addAbsence}
          removeAbsence={removeAbsence}
          color={color}
          displayColorPicker={displayColorPicker}
          setDisplayColorPicker={setDisplayColorPicker}
          handleColorChange={handleColorChange}
        />
        <Spacer size={0.5} axis='vertical' />
        <div className={styles.separator} />

        {currentUser.isAdmin && (
          <>
            <Checkbox
              ref={isAdminRef}
              ariaLabel='isAdmin'
              label='Administrator?'
            />
            <div className={styles.separator} />
          </>
        )}

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
