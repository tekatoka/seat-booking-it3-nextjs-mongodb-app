import { useState } from 'react'
import Image from 'next/image'
import { Booking, WorkingPlace } from '@/api-lib/types'

interface BookingCardProps {
  booking: Booking
  place: WorkingPlace
}

const BookingCard: React.FC<BookingCardProps> = ({ booking, place }) => {
  const [hovered, setHovered] = useState(false)

  return (
    <div
      className='w-full rounded-lg overflow-hidden shadow-lg flex flex-col transition-transform duration-300 transform hover:scale-105'
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div className='relative w-full h-56 overflow-hidden'>
        <Image
          src={place.image ? place.image : '/images/default_user.jpg'}
          alt={place.displayName}
          layout='fill'
          objectFit='contain'
          className={`transform transition-transform duration-200 ${
            hovered ? 'scale-105' : 'scale-100'
          }`}
        />
      </div>
      <div className='bg-black text-white p-2 text-center'>
        {place.displayName}
      </div>
      <div className='bg-white text-black p-2 text-center'>{booking.user}</div>
    </div>
  )
}

export default BookingCard
