import React from 'react'
import Select from 'react-select'

export interface Option {
  value: string
  label: string
}

export interface DropdownSelectProps {
  options: Option[]
  onChange: (selectedOption: Option | null) => void
  placeholder?: string
  value?: Option | null
  noOptionsMessage?: string
}

export const DropdownSelect: React.FC<DropdownSelectProps> = ({
  options,
  onChange,
  placeholder,
  value,
  noOptionsMessage,
  ...props
}) => {
  return (
    <Select
      options={options}
      onChange={newValue => onChange(newValue as Option | null)}
      placeholder={placeholder || 'Select...'}
      className='w-full'
      classNamePrefix='react-select'
      isSearchable
      value={value}
      {...props}
      noOptionsMessage={({ inputValue }) =>
        !inputValue ? noOptionsMessage : 'Keine Optionen verfügbar'
      }
    />
  )
}

DropdownSelect.displayName = 'DropdownSelect'
