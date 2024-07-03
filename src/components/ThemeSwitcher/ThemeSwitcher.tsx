import { useTheme } from 'next-themes'
import { FC, useEffect, useState } from 'react'
import { LuMoon, LuSun, LuMonitor } from 'react-icons/lu'
import { Button } from '../Button' // Ensure the path to Button is correct
import { IconType } from 'react-icons'

const ThemeSwitcher: FC = () => {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const nextTheme: { [key: string]: string } = {
    light: 'dark',
    dark: 'light'
  }

  const ThemeIcon: IconType =
    {
      light: LuSun,
      dark: LuMoon,
      system: LuMonitor
    }[theme || 'light'] || LuSun // Default to LuSun if undefined

  if (!mounted) return null

  return (
    <div className='ml-1'>
      <Button
        size='icon'
        type='button'
        variant='invert'
        onClick={() => {
          const newTheme = nextTheme[theme || 'light']
          setTheme(newTheme)
        }}
      >
        <ThemeIcon className='text-lg' />
        <span className='sr-only'>Toggle theme</span>
      </Button>
    </div>
  )
}

export default ThemeSwitcher
