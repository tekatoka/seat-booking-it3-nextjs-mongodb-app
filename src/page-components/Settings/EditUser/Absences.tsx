import { Absence, AbsenceType } from '@/api-lib/types'
import { Button } from '@/components/Button'
import { LuPlus, LuTrash2 } from 'react-icons/lu'
import { formatDateAsString, stripTime, normalizeDateUTC } from '@/lib/default'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import styles from './EditUser.module.css'
import ColorPicker from './ColorPicker/ColorPicker'
import Checkbox from '@/components/Input/Checkbox'

interface AbsencesProps {
  absences: Absence[]
  handleAbsenceChange: (
    index: number,
    field: keyof Absence,
    value: Date | null | AbsenceType
  ) => void
  addAbsence: () => void
  removeAbsence: (index: number) => void
  handleAbsenceTypeChange: (index: number, type: AbsenceType) => void
  color: string
  displayColorPicker: boolean
  setDisplayColorPicker: (display: boolean) => void
  handleColorChange: (color: any) => void
}

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
  onChange: (
    index: number,
    field: keyof Absence,
    date: Date | null | AbsenceType
  ) => void
  id: string
}) => {
  const parsedDate = normalizeDateUTC(date) ? normalizeDateUTC(new Date(date)) : null
  return (
    <DatePicker
      selected={parsedDate}
      onChange={(date: Date | null) => onChange(index, field, date)}
      dateFormat='dd.MM.yyyy'
      className='ml-1'
      placeholderText={formatDateAsString(new Date())}
      id={id}
    />
  )
}

const Absences: React.FC<AbsencesProps> = ({
  absences,
  handleAbsenceChange,
  addAbsence,
  removeAbsence,
  handleAbsenceTypeChange,
  color,
  displayColorPicker,
  setDisplayColorPicker,
  handleColorChange
}) => {
  return (
    <div>
      <span className={styles.label}>Abwesenheiten</span>
      <ColorPicker
        color={color}
        displayColorPicker={displayColorPicker}
        setDisplayColorPicker={setDisplayColorPicker}
        handleColorChange={handleColorChange}
      />
      <div className='mt-0 mb-4 space-y-4 max-w-full'>
        {absences?.map((absence, index) => (
          <div
            key={index}
            className='flex flex-col sm:flex-row sm:justify-between items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-4 border-b border-gray-300 pb-2 max-w-full'
          >
            <div className='flex flex-col sm:flex-row items-center sm:space-x-4 w-full'>
              <div className='flex items-center space-x-2 w-full sm:w-auto'>
                <label
                  htmlFor={`from-${index}`}
                  className='text-sm sm:text-base'
                >
                  von:
                </label>
                <div className='flex-1 min-w-[120px] md:min-w-[125px] md:max-w-[165px]'>
                  <CustomDatePicker
                    index={index}
                    date={absence.from}
                    field='from'
                    onChange={handleAbsenceChange}
                    id={`from-${index}`}
                  />
                </div>
              </div>
              <div className='flex items-center space-x-2 w-full sm:w-auto mt-2 sm:mt-0'>
                <label
                  htmlFor={`till-${index}`}
                  className='text-sm sm:text-base'
                >
                  bis:
                </label>
                <div className='flex-1 min-w-[120px] md:min-w-[125px] md:max-w-[165px]'>
                  <CustomDatePicker
                    index={index}
                    date={absence.till}
                    field='till'
                    onChange={handleAbsenceChange}
                    id={`till-${index}`}
                  />
                </div>
                <Checkbox
                  ariaLabel='type'
                  label='MA'
                  isChecked={absence.type === 'homeOffice'}
                  onChange={e =>
                    handleAbsenceTypeChange(
                      index,
                      e.target.checked ? 'homeOffice' : 'default'
                    )
                  }
                  smallLabel={true}
                  className='ml-2'
                />
              </div>
            </div>
            <div className='w-full sm:w-auto mt-2 sm:mt-0'>
              <button
                type='button'
                onClick={() => removeAbsence(index)}
                className='w-full sm:w-auto flex items-center justify-center h-full px-3 py-2 border rounded-md text-gray-500 hover:text-red-500 transition-colors duration-200'
              >
                <LuTrash2 />
              </button>
            </div>
          </div>
        ))}
      </div>

      <Button
        type='button'
        onClick={addAbsence}
        variant='invert'
        icon={<LuPlus className='inline-block' />}
      >
        <span>Abwesenheit hinzufügen</span>
      </Button>
    </div>
  )
}

export default Absences
