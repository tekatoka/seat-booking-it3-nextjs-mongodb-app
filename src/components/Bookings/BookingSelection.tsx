import { Button } from '@/components/Button'
import { FormEvent, useCallback, useEffect, useState } from 'react'
import { DropdownSelect, Option } from '@/components/DropdownSelect'
import { User, DayBooking, WorkingPlace } from '@/api-lib/types'
import toast from 'react-hot-toast'
import {
  getUsersNotAbsentAndNoBooking,
  getNewBooking,
  getUsersNotAbsent,
  isUserAbsentToday,
  isUserInHomeOffice
} from '@/lib/dayBooking/utils'
import { Modal } from '@/components/Modal'
import { capitalizeString, useCurrentUser } from '@/lib/user'
import styles from './Booking.module.css'
import { formatDateWithDay } from '@/lib/default'
import clsx from 'clsx'
import RoomPlan from '../RoomPlan/RoomPlan'

interface BookingSelectionProps {
  usersData: any
  todayBooking: any
  workingPlacesData: any
  daybookingData: any
  setTodayBooking: any
  dayBookingMutate: any
  dataCurrentUser: any
}

const BookingSelection: React.FC<BookingSelectionProps> = ({
  usersData,
  todayBooking,
  workingPlacesData,
  daybookingData,
  setTodayBooking,
  dayBookingMutate,
  dataCurrentUser
}) => {
  const [availableUsers, setAvailableUsers] = useState<User[]>()
  const [selectedUser, setSelectedUser] = useState<string | undefined>()
  const [availableUserOptions, setAvailableUserOptions] = useState<Option[]>([])

  const [isLoading, setIsLoading] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false)

  const [currentUser, setCurrentUser] = useState<User | null>(null)

  useEffect(() => {
    setCurrentUser(dataCurrentUser?.user || null)
  }, [dataCurrentUser])

  useEffect(() => {
    const getAvailableUsers = () => {
      const dayBooking = daybookingData?.dayBooking
      if (dayBooking) {
        const availableUsers = getUsersNotAbsentAndNoBooking(dayBooking, {
          users: currentUser ? [currentUser] : usersData?.users
        })
        setAvailableUsers(availableUsers)
        setTodayBooking(dayBooking)
      } else {
        const availableUsers = getUsersNotAbsent({
          users: currentUser ? [currentUser] : usersData?.users
        })
        setAvailableUsers(availableUsers)
      }
    }
    getAvailableUsers()
  }, [usersData, daybookingData, currentUser])

  useEffect(() => {
    const options: Option[] =
      availableUsers?.map(user => ({
        value: user.username,
        label: user.username
      })) || []
    setAvailableUserOptions(options)
  }, [availableUsers])

  const handleChange = (option: Option | null) => {
    setSelectedUser(option?.value)
  }

  const saveBooking = async (updatedTodayBooking: DayBooking) => {
    const url = updatedTodayBooking._id
      ? `/api/dayBookings/${updatedTodayBooking._id}`
      : '/api/dayBookings'
    const method = updatedTodayBooking._id ? 'PATCH' : 'POST'

    const response = await fetch(url, {
      method: method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        date: updatedTodayBooking.date,
        bookings: updatedTodayBooking.bookings
      })
    })

    if (response.ok) {
      dayBookingMutate()
    }

    if (!response.ok) {
      throw new Error(
        `Fehler beim ${
          method === 'POST' ? 'Hinzufügen' : 'Aktualisieren'
        } der Buchung`
      )
    }

    return response.json()
  }

  const onSubmit = useCallback(
    async (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault()
      setIsLoading(true)

      try {
        if (selectedUser) {
          const newBooking = getNewBooking(
            selectedUser,
            todayBooking,
            {
              workingPlaces:
                workingPlacesData?.workingPlaces.filter(
                  (p: WorkingPlace) => p.isActive
                ) || []
            },
            usersData
          )

          if (newBooking) {
            const updatedTodayBooking = {
              ...todayBooking,
              bookings: [...todayBooking.bookings, newBooking]
            }

            try {
              await saveBooking(updatedTodayBooking)
              setTodayBooking(updatedTodayBooking)

              toast.success(
                t => (
                  <div
                    onClick={() => toast.dismiss(t.id)}
                    role='button'
                    tabIndex={0}
                    onKeyDown={e => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        toast.dismiss(t.id)
                      }
                    }}
                    style={{ cursor: 'pointer' }}
                  >
                    {capitalizeString(newBooking.user)} sitzt heute auf dem{' '}
                    {capitalizeString(newBooking.workingPlace)}-Platz!
                  </div>
                ),
                {
                  duration: 5000
                }
              )
            } catch (error) {
              console.error('Error adding booking:', error)
              toast.error('Es ist ein Fehler aufgetreten! :(')
            }
          }
        }
      } catch (e) {
        toast.error('Es ist ein Fehler aufgetreten! :(')
      } finally {
        setIsLoading(false)
      }
    },
    [selectedUser, todayBooking, workingPlacesData]
  )

  const handleOpenModal = () => {
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
  }

  const getNoOptionsMessage = (currentUser: User | null) => {
    if (!currentUser)
      return 'Alle Benutzer haben bereits ihre Plätze im Zoogehege gefunden!'

    if (isUserAbsentToday(currentUser)) {
      return 'Du bist heute als Abwesend gemeldet. Du kannst das in den Profil-Einstellungen ändern'
    }

    if (isUserInHomeOffice(currentUser)) {
      return 'Heute ist Dein MA-Tag. Falsch? Du kannst das in den Profil-Einstellungen ändern'
    }

    if (currentUser) return 'Du hast heute bereits einen Arbeitsplatz gebucht!'

    return 'Alle Benutzer haben bereits ihre Plätze im Zoogehege gefunden!'
  }

  return (
    <div className='container mx-auto p-0'>
      <div className='grid gap-0 lg:grid-cols-8'>
        <div className='col-span-4 lg:col-span-2 order-1 lg:order-1'>
          <div className='p-4'>
            <div className={clsx(styles.meta, styles.metaLabel)}>
              Heute ist...
            </div>
            {formatDateWithDay(new Date())}
          </div>
        </div>

        <div className='col-span-8 lg:col-span-4 order-3 lg:order-2'>
          <div className='p-4'>
            <form onSubmit={onSubmit}>
              <div className='flex flex-col sm:flex-row sm:space-x-4 space-y-4 sm:space-y-0'>
                <DropdownSelect
                  options={availableUserOptions}
                  onChange={handleChange}
                  placeholder='Wähle deinen Namen...'
                  value={
                    availableUserOptions.find(
                      option => option.value === selectedUser
                    ) || null
                  }
                  noOptionsMessage={getNoOptionsMessage(currentUser)}
                />
                <Button
                  size='medium'
                  variant='primary'
                  type='submit'
                  disabled={!selectedUser}
                >
                  Los!
                </Button>
              </div>
            </form>
          </div>
        </div>

        <div className='col-span-4 lg:col-span-2 order-2 lg:order-3 text-right'>
          <div className='p-4'>
            <Button
              size='medium'
              variant='primary'
              type='button'
              onClick={handleOpenModal}
              style={{ display: 'inline' }}
            >
              Zoogehege
            </Button>
          </div>
        </div>
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title='IT-3 Zoogehege'
      >
        <RoomPlan
          workingPlaces={workingPlacesData?.workingPlaces}
          todayBooking={todayBooking?.bookings}
        />
        {/* <img
          src='images/zoogehege.png'
          alt='Zoogehege'
          style={{ width: '100%' }}
          title='Zoogehege'
        /> */}
      </Modal>
    </div>
  )
}

export default BookingSelection
