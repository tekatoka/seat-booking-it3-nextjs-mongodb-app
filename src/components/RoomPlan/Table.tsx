import { Booking, WorkingPlace } from '@/api-lib/types'
import clsx from 'clsx'
import React from 'react'
import styles from './RoomPlan.module.css'

interface TableProps {
  name: string
  workingPlace: WorkingPlace[]
  booking?: Booking
  className?: string
}

const Table: React.FC<TableProps> = ({
  name,
  workingPlace,
  booking,
  className
}) => {
  const place = workingPlace.find(place => place.displayName === name) || {
    displayName: '',
    pcName: ''
  }
  return (
    <div
      className={clsx(
        styles.table,
        className,
        booking ? styles.hasBooking : ''
      )}
    >
      {place.displayName}
      {place.pcName && <div>({place.pcName})</div>}
      {/* {booking && <div>{booking.user}</div>} */}
    </div>
  )
}

export default Table
