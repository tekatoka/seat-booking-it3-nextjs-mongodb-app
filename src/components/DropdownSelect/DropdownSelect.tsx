import useColors from '@/lib/hooks'
import clsx from 'clsx'
import { useTheme } from 'next-themes'
import React from 'react'
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
  noOptionsMessage?: string
  isClearable?: boolean
}

export const DropdownSelect: React.FC<DropdownSelectProps> = ({
  options,
  onChange,
  placeholder,
  value,
  noOptionsMessage,
  isClearable,
  ...props
}) => {
  const { foregroundColor, backgroundColor } = useColors()
  const customStyles = {
    control: (base: any) => ({
      ...base,
      height: 40,
      minHeight: 40,
      backgroundColor: backgroundColor
    }),
    menu: (base: any) => ({
      ...base,
      color: foregroundColor,
      zIndex: 1000,
      backgroundColor: backgroundColor,
      borderWidth: foregroundColor == '#ffffff' && '1px',
      borderColor: foregroundColor
    }),
    option: (base: any, state: any) => ({
      ...base,
      color:
        state.isSelected || state.isFocused
          ? backgroundColor === '#000000'
            ? backgroundColor
            : foregroundColor
          : foregroundColor,
      '&:hover': {
        color: backgroundColor === '#000000' ? backgroundColor : foregroundColor
      }
    })
  }
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
      isClearable={isClearable}
    />
  )
}

DropdownSelect.displayName = 'DropdownSelect'
