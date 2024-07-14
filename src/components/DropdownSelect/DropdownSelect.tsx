import clsx from 'clsx'
import React from 'react'
import Select from 'react-select'
import styles from './DropdownSelect.module.css'

export interface Option {
  value: string
  label: string
}

const customStyles = {
  control: (base: any) => ({
    ...base,
    height: 40,
    minHeight: 40
  })
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
      className={clsx(styles.selectControl, 'w-full')}
      classNamePrefix='react-select'
      isSearchable
      value={value}
      {...props}
      noOptionsMessage={({ inputValue }) =>
        !inputValue ? noOptionsMessage : 'Keine Optionen verfügbar'
      }
      styles={customStyles}
    />
  )
}

DropdownSelect.displayName = 'DropdownSelect'
