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
}

export const DropdownSelect: React.FC<DropdownSelectProps> = ({
  options,
  onChange,
  placeholder
}) => {
  return (
    <Select
      options={options}
      onChange={onChange}
      placeholder={placeholder || 'Select...'}
      className='w-full'
      classNamePrefix='react-select'
      isSearchable
    />
  )
}
