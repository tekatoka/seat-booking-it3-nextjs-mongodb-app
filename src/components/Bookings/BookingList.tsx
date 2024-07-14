import { Wrapper } from '@/components/Layout'
import { WorkingPlace, Booking } from '@/api-lib/types'

interface BookingListProps {
  todayBooking: any
  workingPlacesData: any
}

const BookingList: React.FC<BookingListProps> = ({
  todayBooking,
  workingPlacesData
}) => {
  return (
    <Wrapper>
      {todayBooking &&
        todayBooking.bookings.map((booking: Booking) => {
          const place = workingPlacesData?.workingPlaces.find(
            (place: WorkingPlace) => place.name === booking.workingPlace
          )
          return place ? (
            <div key={booking.user} className='mt-4'>
              <p>
                {booking.user} sitzt auf {place.displayName}
              </p>
            </div>
          ) : null
        })}
    </Wrapper>
  )
}

export default BookingList
