import Select from 'react-select'
import styles from './DropdownSelect.module.css'

export interface Option {
  value: string
  label: string
}

export interface DropdownSelectProps {
  options: Option[]
  onChange: (selectedOption: Option | null) => void
  placeholder?: string
  value?: Option | null
}

export const DropdownSelect: React.FC<DropdownSelectProps> = ({
  options,
  onChange,
  placeholder,
  value
}) => {
  return (
    <Select
      options={options}
      onChange={onChange}
      placeholder={placeholder || 'Select...'}
      className='w-full'
      classNamePrefix='react-select'
      isSearchable
      value={value}
    />
  )
}
