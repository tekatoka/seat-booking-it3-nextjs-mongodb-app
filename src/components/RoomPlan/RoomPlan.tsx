import { WorkingPlace } from '@/api-lib/types'
import clsx from 'clsx'
import React from 'react'
import styles from './RoomPlan.module.css'

interface TableProps {
  name: string
  workingPlace: WorkingPlace[]
  className?: string
}

const Table: React.FC<TableProps> = ({ name, workingPlace, className }) => {
  const place = workingPlace.find(place => place.displayName === name) || {
    displayName: '',
    pcName: ''
  }
  return (
    <div className={clsx(styles.table, className)}>
      {place.displayName}
      {place.pcName && <div>({place.pcName})</div>}
    </div>
  )
}

interface RoomProps {
  workingPlaces: WorkingPlace[]
}

const RoomPlan: React.FC<RoomProps> = ({ workingPlaces }) => {
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
            className={styles.verticalTable}
          />
          <Table
            name='Eichhörnchen'
            workingPlace={workingPlaces}
            className={styles.verticalTable}
          />
        </div>
        <div className={styles.row}>
          <Table
            name='Bowser'
            workingPlace={workingPlaces}
            className={styles.verticalTable}
          />
          <div className={styles.emptySpace}></div>
        </div>
      </div>
      <div className={styles.columnBottom}>
        <Table
          name='Eule'
          workingPlace={workingPlaces}
          className={styles.horizontalTable}
        />
        <div className={styles.row}>
          <Table
            name='Einhorn'
            workingPlace={workingPlaces}
            className={styles.verticalTable}
          />
          <Table
            name='Fuchs'
            workingPlace={workingPlaces}
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
            className={styles.verticalTable}
          />
          <Table
            name='Katze'
            workingPlace={workingPlaces}
            className={styles.verticalTable}
          />
        </div>
        <div className={styles.smallSpace}></div>
        <div className={styles.row}>
          <Table
            name='Giraffe'
            workingPlace={workingPlaces}
            className={styles.verticalTable}
          />
          <Table
            name='Hund'
            workingPlace={workingPlaces}
            className={styles.verticalTable}
          />
        </div>
      </div>
      <div className={styles.columnTop}>
        <div className={styles.row}>
          <Table
            name='Pikachu'
            workingPlace={workingPlaces}
            className={styles.verticalTable}
          />
          <Table
            name='Schiggy'
            workingPlace={workingPlaces}
            className={styles.verticalTable}
          />
        </div>
        <Table
          name='Koala'
          workingPlace={workingPlaces}
          className={styles.horizontalTable}
        />
      </div>
    </div>
  )
}

export default RoomPlan
