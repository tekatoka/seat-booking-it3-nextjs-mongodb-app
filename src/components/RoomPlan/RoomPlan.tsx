import { Booking, WorkingPlace } from '@/api-lib/types'
import { capitalizeString } from '@/lib/user'
import clsx from 'clsx'
import React from 'react'
import styles from './RoomPlan.module.css'
import Table from './Table'

interface RoomProps {
  workingPlaces: WorkingPlace[]
  todayBooking?: Booking[]
}

const RoomPlan: React.FC<RoomProps> = ({ workingPlaces, todayBooking }) => {
  const findBooking = (name: string) =>
    todayBooking?.find(
      booking =>
        capitalizeString(booking.workingPlace) === capitalizeString(name)
    )

  const wombat = workingPlaces.find(
    place => place.displayName === 'Wombat'
  ) || { displayName: '', pcName: '' }

  const yoda = workingPlaces.find(place => place.displayName === 'Yoda') || {
    displayName: '',
    pcName: ''
  }

  return (
    <div className={styles.room}>
      <div className={styles.label}>
        {wombat.displayName} ({wombat.pcName}): B-206
        {/* <br />
        {yoda.displayName}: B-233 */}
      </div>
      <div className={clsx(styles.columnBottom, styles.columnBottomNoBorder)}>
        <div className={styles.row}>
          <Table
            name='Bär'
            workingPlace={workingPlaces}
            booking={findBooking('Bär')}
            className={styles.verticalTable}
          />
          <Table
            name='Eichhörnchen'
            workingPlace={workingPlaces}
            booking={findBooking('Eichhörnchen')}
            className={styles.verticalTable}
          />
        </div>
        <div className={styles.row}>
          <Table
            name='Bowser'
            workingPlace={workingPlaces}
            booking={findBooking('Bowser')}
            className={styles.verticalTable}
          />
          <div className={styles.emptySpace}></div>
        </div>
      </div>
      <div className={styles.columnBottom}>
        <Table
          name='Eule'
          workingPlace={workingPlaces}
          booking={findBooking('Eule')}
          className={styles.horizontalTable}
        />
        <div className={styles.row}>
          <Table
            name='Einhorn'
            workingPlace={workingPlaces}
            booking={findBooking('Einhorn')}
            className={styles.verticalTable}
          />
          <Table
            name='Fuchs'
            workingPlace={workingPlaces}
            booking={findBooking('Fuchs')}
            className={styles.verticalTable}
          />
        </div>
      </div>
      <div className={styles.columnWhite}>
        <div className={styles.greyRectangle}></div>
      </div>
      <div className={styles.column}>
        <div className={styles.row}>
          <Table
            name='Kaktus'
            workingPlace={workingPlaces}
            booking={findBooking('Kaktus')}
            className={styles.verticalTable}
          />
          <Table
            name='Katze'
            workingPlace={workingPlaces}
            booking={findBooking('Katze')}
            className={styles.verticalTable}
          />
        </div>
        <div className={styles.smallSpace}></div>
        <div className={styles.row}>
          <Table
            name='Giraffe'
            workingPlace={workingPlaces}
            booking={findBooking('Giraffe')}
            className={styles.verticalTable}
          />
          <Table
            name='Hund'
            workingPlace={workingPlaces}
            booking={findBooking('Hund')}
            className={styles.verticalTable}
          />
        </div>
      </div>
      <div className={styles.columnTop}>
        <div className={styles.row}>
          <Table
            name='Pikachu'
            workingPlace={workingPlaces}
            booking={findBooking('Pikachu')}
            className={styles.verticalTable}
          />
          <Table
            name='Schiggy'
            workingPlace={workingPlaces}
            booking={findBooking('Schiggy')}
            className={styles.verticalTable}
          />
        </div>
        <Table
          name='Koala'
          workingPlace={workingPlaces}
          booking={findBooking('Koala')}
          className={styles.horizontalTable}
        />
      </div>
    </div>
  )
}

export default RoomPlan
