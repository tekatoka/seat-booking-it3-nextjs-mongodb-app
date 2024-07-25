import { Absence } from '@/api-lib/types'
import { formatDateAsString, stripTime, normalizeDateUTC } from '@/lib/default'
import DatePicker, { registerLocale } from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import { de } from 'date-fns/locale/de'

registerLocale('de', de)

const CustomDatePicker = ({
  index,
  date,
  field,
  onChange,
  id
}: {
  index: number
  date: Date | string | undefined
  field: keyof Absence
  onChange: (index: number, field: keyof Absence, date: Date | null) => void
  id: string
}) => {
  const parsedDate = date ? normalizeDateUTC(new Date(date)) : null
  registerLocale('de', de)
  return (
    <DatePicker
      selected={parsedDate}
      onChange={(date: Date | null) => onChange(index, field, date)}
      dateFormat='dd.MM.yyyy'
      className='ml-1'
      placeholderText={formatDateAsString(new Date())}
      id={id}
      locale={de}
    />
  )
}

export default CustomDatePicker
