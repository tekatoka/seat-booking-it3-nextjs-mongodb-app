import useColors from '@/lib/hooks'
import clsx from 'clsx'
import React, { useEffect, useState } from 'react'
import Select, { components } from 'react-select'
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

// Custom SingleValue component for tooltip or other customization
const CustomSingleValue = (props: any) => {
  return (
    <components.SingleValue {...props}>
      <div title={props.data.label}>{props.data.label}</div>
    </components.SingleValue>
  )
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
  const [isDisabled, setIsDisabled] = useState(false)
  const [selectedValue, setSelectedValue] = useState<Option | null>(
    value || null
  )

  useEffect(() => {
    if (options.length === 1) {
      setSelectedValue(options[0])
      onChange(options[0])
      setIsDisabled(false)
    } else if (options.length === 0) {
      setSelectedValue({ label: noOptionsMessage ?? '', value: 'no-options' })
      setIsDisabled(true)
    } else {
      setIsDisabled(false)
      if (!options.find(option => option.value === selectedValue?.value)) {
        setSelectedValue(null)
      }
    }
  }, [options, onChange, noOptionsMessage])

  const { foregroundColor, backgroundColor } = useColors()
  const customStyles = {
    control: (base: any) => ({
      ...base,
      height: 'auto',
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
    }),
    singleValue: (provided: any) => ({
      ...provided,
      whiteSpace: 'pre-wrap'
    })
  }
  return (
    <Select
      options={options}
      onChange={newValue => {
        setSelectedValue(newValue as Option | null)
        onChange(newValue as Option | null)
      }}
      placeholder={placeholder || 'Wählen...'}
      className={clsx(styles.selectControl, 'w-full')}
      classNamePrefix='react-select'
      isSearchable
      value={selectedValue}
      noOptionsMessage={({ inputValue }) =>
        !inputValue ? noOptionsMessage : 'Keine Optionen verfügbar'
      }
      styles={customStyles}
      isClearable={isClearable}
      isDisabled={isDisabled}
      components={{ SingleValue: CustomSingleValue }} // Use the custom SingleValue component
      {...props}
    />
  )
}

DropdownSelect.displayName = 'DropdownSelect'
