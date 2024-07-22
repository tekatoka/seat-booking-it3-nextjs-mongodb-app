import React from 'react'
import { Calendar, dateFnsLocalizer } from 'react-big-calendar'
import { format, parse, startOfWeek, getDay } from 'date-fns'
import { de } from 'date-fns/locale'
import 'react-big-calendar/lib/css/react-big-calendar.css'
import { CalendarAbsence, CalendarHomeOfficeDay } from '@/api-lib/types'
import CustomToolbar from './CustomToolbar'
import styles from './Calendar.module.css'
import { formatDate, normalizeDateUTC } from '@/lib/default'

interface UserCalendarProps {
  absences: CalendarAbsence[]
  homeOfficeDays: CalendarHomeOfficeDay[]
  onRangeChange: (start: Date, end: Date) => void
  endDate: Date
}

const locales = {
  de: de
}

const localizer = dateFnsLocalizer({
  format: (date: Date, formatStr: string) =>
    format(date, formatStr, { locale: de }),
  parse: (dateStr: string, formatStr: string) =>
    parse(dateStr, formatStr, new Date(), { locale: de }),
  startOfWeek: (date: Date) => startOfWeek(date, { locale: de }),
  getDay: (date: Date) => getDay(date),
  locales
})

const eventStyleGetter = (
  event: { title: string; start: Date; end: Date; color?: string },
  start: Date,
  end: Date,
  isSelected: boolean
) => {
  let backgroundColor = '#3174ad' // default color

  if (event.title.includes('abwesend')) {
    backgroundColor = event.color || '#f56c6c' // red for absence
  } else if (event.title.includes('Home Office')) {
    backgroundColor = '#67c23a' // blue for home office
  }

  const style: React.CSSProperties = {
    backgroundColor,
    color: 'white',
    borderRadius: '5px',
    border: 'none',
    display: 'block',
    padding: '4px',
    fontSize: '14px'
  }

  return { style }
}

const UserCalendar: React.FC<UserCalendarProps> = ({
  absences,
  homeOfficeDays,
  onRangeChange,
  endDate
}) => {
  const events = [
    ...absences.map(absence => ({
      title: `${absence.user} abwesend ${
        absence.till ? 'bis ' + formatDate(new Date(absence.till)) : ''
      }`,
      start: new Date(absence.from),
      end: absence.till ? new Date(absence.till) : normalizeDateUTC(endDate),
      color: absence.color
    })),
    ...homeOfficeDays.map(day => ({
      title: `${day.user} MA`,
      start: new Date(day.date),
      end: new Date(day.date)
    }))
  ]

  const handleRangeChange = (range: Date[] | { start: Date; end: Date }) => {
    if (Array.isArray(range)) {
      onRangeChange(range[0], range[range.length - 1])
    } else {
      onRangeChange(range.start, range.end)
    }
  }

  const formats = { dayHeaderFormat: 'E dd. MMMM' }

  return (
    <div className={styles.wrap}>
      <Calendar
        localizer={localizer}
        events={events}
        startAccessor='start'
        endAccessor='end'
        style={{ height: 500 }}
        onRangeChange={handleRangeChange}
        eventPropGetter={eventStyleGetter}
        components={{ toolbar: CustomToolbar }}
        messages={{
          allDay: 'Ganztägig',
          previous: 'Zurück',
          next: 'Weiter',
          today: 'Heute',
          month: 'Monat',
          week: 'Woche',
          day: 'Tag',
          agenda: 'Agenda',
          date: 'Datum',
          time: 'Uhrzeit',
          event: 'Ereignis',
          noEventsInRange: 'Keine Ereignisse in diesem Zeitraum.',
          showMore: total => `+ Mehr anzeigen (${total})`
        }}
        culture='de'
        formats={formats}
        dayLayoutAlgorithm='no-overlap'
        showAllEvents
        views={{
          month: true,
          work_week: true,
          day: true,
          agenda: false
        }}
      />
    </div>
  )
}

export default UserCalendar
