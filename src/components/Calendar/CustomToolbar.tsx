import { FaArrowLeft, FaArrowRight, FaCalendarAlt } from 'react-icons/fa'

const CustomToolbar = (toolbar: any) => {
  const goToBack = () => {
    toolbar.onNavigate('PREV')
  }

  const goToNext = () => {
    toolbar.onNavigate('NEXT')
  }

  const goToToday = () => {
    toolbar.onNavigate('TODAY')
  }

  const renderButton = (
    onClick: () => void,
    Icon: any,
    text: string,
    iconPosition: 'left' | 'right' = 'left'
  ) => (
    <button type='button' onClick={onClick} style={{ display: 'inline-flex' }}>
      {iconPosition === 'left' && (
        <Icon style={{ marginRight: '4px', marginTop: '2px' }} />
      )}
      {text}
      {iconPosition === 'right' && (
        <Icon style={{ marginLeft: '4px', marginTop: '2px' }} />
      )}
    </button>
  )

  return (
    <div className='rbc-toolbar'>
      <span className='rbc-btn-group'>
        {renderButton(goToBack, FaArrowLeft, 'Zurück')}
        {renderButton(goToToday, FaCalendarAlt, 'Heute')}
        {renderButton(goToNext, FaArrowRight, 'Weiter', 'right')}
      </span>
      <span className='rbc-toolbar-label'>{toolbar.label}</span>
      <span className='rbc-btn-group'>
        <button
          type='button'
          onClick={() => toolbar.onView('month')}
          className={toolbar.view === 'month' ? 'active' : ''}
        >
          Monat
        </button>
        <button
          type='button'
          onClick={() => toolbar.onView('work_week')}
          className={toolbar.view === 'work_week' ? 'active' : ''}
        >
          Woche
        </button>
        <button
          type='button'
          onClick={() => toolbar.onView('day')}
          className={toolbar.view === 'day' ? 'active' : ''}
        >
          Tag
        </button>
        {/* <button type='button' onClick={() => toolbar.onView('agenda')}>
          Agenda
        </button> */}
      </span>
    </div>
  )
}

export default CustomToolbar
