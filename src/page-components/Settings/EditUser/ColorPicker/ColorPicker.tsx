import { ColorIndicator } from '@/components/Indicator'
import React, { useEffect, useRef } from 'react'
import { SketchPicker } from 'react-color'
import styles from './ColorPicker.module.css'

interface ColorPickerProps {
  color: string
  displayColorPicker: boolean
  setDisplayColorPicker: (display: boolean) => void
  handleColorChange: (color: any) => void
}

const ColorPicker: React.FC<ColorPickerProps> = ({
  color,
  displayColorPicker,
  setDisplayColorPicker,
  handleColorChange
}) => {
  const popoverRef = useRef<HTMLDivElement>(null)

  const handleClickOutside = (event: MouseEvent) => {
    if (
      popoverRef.current &&
      !popoverRef.current.contains(event.target as Node)
    ) {
      setDisplayColorPicker(false)
    }
  }

  useEffect(() => {
    if (displayColorPicker) {
      document.addEventListener('mousedown', handleClickOutside)
    } else {
      document.removeEventListener('mousedown', handleClickOutside)
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [displayColorPicker])

  return (
    <div className={styles.colorPickerContainer}>
      <button
        type='button'
        className={styles.colorButton}
        onClick={() => setDisplayColorPicker(!displayColorPicker)}
      >
        <ColorIndicator
          color={color}
          label='Team-Kalender-Farbe'
          size='large'
        />
      </button>
      {displayColorPicker && (
        <div className={styles.colorPickerPopover} ref={popoverRef}>
          <SketchPicker color={color} onChange={handleColorChange} />
        </div>
      )}
    </div>
  )
}

export default ColorPicker
