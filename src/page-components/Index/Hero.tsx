import { Button, ButtonLink } from '@/components/Button'
import { Container, Spacer, Wrapper } from '@/components/Layout'
import styles from './Hero.module.css'
import { ObjectId } from 'mongodb'
import { useEffect, useState } from 'react'
import { DropdownSelect, Option } from '@/components/DropdownSelect'

interface Absence {
  from: Date
  till?: Date
}

interface Place {
  _id?: ObjectId
  name: string
  displayName: string
  pcName: string
  picture?: string
}

interface User {
  _id?: ObjectId
  username: string
  password: string
  favouritePlaces?: string[]
  absences?: Absence[]
  createdAt?: Date
}

interface Booking {
  user: string
  place: string
}

interface DayBooking {
  _id?: ObjectId
  date: Date
  bookings: Booking[]
}

const places: Place[] = [
  {
    name: 'bowser',
    displayName: 'Bowser',
    pcName: 'PC4130'
  },
  {
    name: 'baer',
    displayName: 'Baer',
    pcName: 'PC5556'
  },
  {
    name: 'eichhoernchen',
    displayName: 'Eichhoernchen',
    pcName: 'PC4146'
  },
  {
    name: 'einhorn',
    displayName: 'Einhorn',
    pcName: 'PC4784'
  },
  {
    name: 'eule',
    displayName: 'Eule',
    pcName: 'PC4873'
  },
  {
    name: 'fuchs',
    displayName: 'Fuchs',
    pcName: 'PC4712'
  },
  {
    name: 'giraffe',
    displayName: 'Giraffe',
    pcName: 'PC4465'
  },
  {
    name: 'hund',
    displayName: 'Hund',
    pcName: 'PC4819'
  },
  {
    name: 'kaktus',
    displayName: 'Kaktus',
    pcName: 'PC5557'
  },
  {
    name: 'katze',
    displayName: 'Katze',
    pcName: 'PC5558'
  },
  {
    name: 'pikachu',
    displayName: 'Pikachu',
    pcName: 'PC4305'
  },
  {
    name: 'schiggy',
    displayName: 'Schiggy',
    pcName: 'PC4400'
  },
  {
    name: 'koala',
    displayName: 'Koala',
    pcName: 'PC4189'
  },
  {
    name: 'wombat',
    displayName: 'Wombat',
    pcName: 'PC4577'
  },
  {
    name: 'yoda',
    displayName: 'Yoda',
    pcName: 'PCxxxx'
  }
]

const users: User[] = [
  {
    username: 'Arthur',
    password: 'password123',
    favouritePlaces: ['baer', 'bowser']
  },
  {
    username: 'Benny',
    password: 'password123',
    favouritePlaces: ['eichhoernchen'],
    absences: [
      {
        from: new Date('2024-06-01T00:00:00.000Z'),
        till: new Date('2024-08-10T00:00:00.000Z')
      }
    ]
  },
  {
    username: 'Chris',
    password: 'password123',
    favouritePlaces: ['einhorn', 'eule']
  },
  {
    username: 'Christian',
    password: 'password123',
    favouritePlaces: ['fuchs']
  },
  {
    username: 'Corinna',
    password: 'password123',
    favouritePlaces: ['giraffe', 'hund']
  },
  {
    username: 'Dana',
    password: 'password123',
    favouritePlaces: ['kaktus']
  },
  {
    username: 'Eike',
    password: 'password123',
    favouritePlaces: ['katze', 'pikachu']
  },
  {
    username: 'Felix',
    password: 'password123',
    favouritePlaces: ['schiggy'],
    absences: [
      {
        from: new Date('2024-07-01T00:00:00.000Z')
      }
    ]
  },
  {
    username: 'Frank',
    password: 'password123',
    favouritePlaces: ['koala', 'wombat']
  },
  {
    username: 'Gordon',
    password: 'password123',
    favouritePlaces: ['yoda']
  },
  {
    username: 'Iljana',
    password: 'password123',
    favouritePlaces: ['bowser', 'eule']
  },
  {
    username: 'Jessica',
    password: 'password123',
    favouritePlaces: ['fuchs', 'baer'],
    absences: [
      {
        from: new Date('2023-05-01T00:00:00.000Z'),
        till: new Date('2023-05-15T00:00:00.000Z')
      }
    ]
  },
  {
    username: 'Karin',
    password: 'password123',
    favouritePlaces: ['eichhoernchen', 'einhorn']
  },
  {
    username: 'Max',
    password: 'password123',
    favouritePlaces: ['fuchs']
  },
  {
    username: 'Ronny',
    password: 'password123',
    favouritePlaces: ['giraffe']
  },
  {
    username: 'Toni',
    password: 'password123',
    favouritePlaces: ['hund', 'kaktus']
  },
  {
    username: 'Tom',
    password: 'password123',
    favouritePlaces: ['katze'],
    absences: [
      {
        from: new Date('2023-08-01T00:00:00.000Z'),
        till: new Date('2023-08-15T00:00:00.000Z')
      }
    ]
  }
]

// Mock database functions
async function getAllUsers(): Promise<User[]> {
  // Implement your database retrieval logic here
  return users
}

async function getDayBooking(date: Date): Promise<DayBooking | null> {
  // Implement your database retrieval logic here

  const booking: DayBooking = {
    date: new Date(),
    bookings: [
      {
        place: 'fuchs',
        user: 'Max'
      },
      {
        place: 'baer',
        user: 'Gordon'
      }
    ]
  }
  return booking
}

async function createDayBooking(date: Date): Promise<DayBooking> {
  // Implement your database creation logic here
  return { date, bookings: [] }
}

async function updateDayBooking(dayBooking: DayBooking): Promise<void> {
  // Implement your database update logic here
}

async function getUserByUsername(username: string): Promise<User | null> {
  // Implement your database retrieval logic here
  const user = users.find(
    u => u.username.toLocaleLowerCase() == username.toLocaleLowerCase()
  )
  return user ?? null
}

function getRandomPlace(excludedPlaces: string[]): string {
  const availablePlaces = places
    .filter(place => !excludedPlaces.includes(place.name))
    .map(place => place.name)
  return availablePlaces[Math.floor(Math.random() * availablePlaces.length)]
}

function isUserAbsentToday(user: User, today: Date): boolean {
  if (!user.absences) {
    return false
  }
  return user.absences.some(absence => {
    const from = new Date(absence.from)
    const till = absence.till ? new Date(absence.till) : null
    return from <= today && (!till || till >= today)
  })
}

async function getUsersNotAbsentAndNoBooking(): Promise<User[]> {
  const today = new Date()
  today.setHours(0, 0, 0, 0) // Normalize to midnight

  const users = await getAllUsers()
  const dayBooking = await getDayBooking(today)

  const usersWithNoBookingToday = users.filter(user => {
    const hasBookingToday = dayBooking?.bookings.some(
      booking => booking.user === user.username
    )
    const isAbsentToday = isUserAbsentToday(user, today)
    return !hasBookingToday && !isAbsentToday
  })

  return usersWithNoBookingToday
}

async function addBooking(username: string): Promise<DayBooking> {
  const today = new Date()
  today.setHours(0, 0, 0, 0) // Normalize to midnight

  let dayBooking = await getDayBooking(today)
  if (!dayBooking) {
    dayBooking = await createDayBooking(today)
  }

  const user = await getUserByUsername(username)
  if (!user) {
    throw new Error(`User ${username} not found`)
  }

  if (dayBooking.bookings.some(booking => booking.user === username)) {
    console.log(`User ${username} already has a booking for today`)
    return dayBooking
  }

  const takenPlaces = dayBooking.bookings.map(booking => booking.place)
  let placeToBook =
    user.favouritePlaces?.find(place => !takenPlaces.includes(place)) ??
    getRandomPlace(takenPlaces)

  while (takenPlaces.includes(placeToBook)) {
    placeToBook = getRandomPlace(takenPlaces)
  }

  const newBooking: Booking = {
    user: username,
    place: placeToBook
  }

  dayBooking.bookings.push(newBooking)
  await updateDayBooking(dayBooking)

  console.log(`Booking added: ${username} at ${placeToBook}`)

  return dayBooking
}

const test = async (name: string) => await addBooking(name)

const Hero: React.FC = () => {
  const [absentUsers, setAbsentUsers] = useState<User[]>()
  const [availableUsers, setAvailableUsers] = useState<User[]>()
  const [selectedUser, setSelectedUser] = useState<string | undefined>()
  const [availableUserOptions, setAvailableUserOptions] = useState<Option[]>([])
  const [allBookings, setAllBookings] = useState<DayBooking | null>()

  useEffect(() => {
    const getAvailableUsers = async () => {
      const allUsers = await getAllUsers()
      await getUsersNotAbsentAndNoBooking().then(users => {
        setAvailableUsers(users)
      })

      setAbsentUsers(allUsers.filter(u => isUserAbsentToday(u, new Date())))
    }
    getAvailableUsers()
  }, [, allBookings])

  useEffect(() => {
    const getCurrentBooking = async () => {
      await getDayBooking(new Date()).then(booking => {
        setAllBookings(booking)
      })
    }

    getCurrentBooking()
  }, [])

  useEffect(() => {
    let options: Option[] = []
    availableUsers &&
      availableUsers.map(user => {
        const option: Option = {
          value: user.username,
          label: user.username
        }
        options = [...options, option]
      })
    setAvailableUserOptions(options)
  }, [availableUsers])

  const handleChange = (option: Option | null) => {
    setSelectedUser(option?.value)
  }

  const handleSubmit = async (selectedUser: string) => {
    const updatedBookings = await addBooking(selectedUser)
    setAllBookings(updatedBookings)
  }

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('de-DE', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    })
  }

  return (
    <Wrapper>
      <div className='container mx-auto p-4'>
        {allBookings && <>Total bookings: {allBookings?.bookings.length}</>}
        <br />
        Heute ist der {formatDate(new Date())}
        <br />
        {absentUsers && (
          <>
            Heute nicht da:{' '}
            {absentUsers?.map((u, i) => (
              <span key={u.username}>
                {`${u.username}${i < absentUsers.length - 1 ? ', ' : ''}`}
              </span>
            ))}
          </>
        )}
        <h1 className='text-2xl font-bold mb-4'>Select a Place</h1>
        <div className='flex flex-col sm:flex-row sm:space-x-4 space-y-4 sm:space-y-0'>
          <DropdownSelect
            options={availableUserOptions}
            onChange={handleChange}
            placeholder='Select a place...'
          />
          <Button
            size='medium'
            variant='primary'
            type='button'
            disabled={!selectedUser}
            onClick={() => selectedUser && handleSubmit(selectedUser)}
          >
            Figur erfahren!
          </Button>
        </div>
        {allBookings &&
          allBookings.bookings &&
          allBookings.bookings.map(booking => {
            const place = places.find(place => place.name === booking.place)
            return place ? (
              <div key={booking.user} className='mt-4'>
                <p>
                  {booking.user} sitzt auf {place.displayName}
                </p>
              </div>
            ) : (
              ''
            )
          })}
      </div>

      <div>
        <h1 className={styles.title}>
          <span className={styles.nextjs}>Next.js</span>
          <span className={styles.mongodb}>MongoDB</span>
          <span>App</span>
        </h1>
        <Container justifyContent='center' className={styles.buttons}>
          <Container>
            <ButtonLink href='/feed' className={styles.button}>
              Explore Feed
            </ButtonLink>
          </Container>
          <Spacer axis='horizontal' size={1} />
          <Container>
            <ButtonLink
              href='https://github.com/hoangvvo/nextjs-mongodb-app'
              type='button'
              variant='secondary'
              className={styles.button}
            >
              GitHub
            </ButtonLink>
          </Container>
        </Container>
        <p className={styles.subtitle}>
          A Next.js and MongoDB web application, designed with simplicity for
          learning and real-world applicability in mind.
        </p>
      </div>
    </Wrapper>
  )
}

export default Hero
