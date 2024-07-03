import { useTheme } from 'next-themes'
import { useCallback, ChangeEvent } from 'react'
import styles from './ThemeSwitcher.module.css'

const ThemeSwitcher: React.FC = () => {
  const { theme, setTheme } = useTheme()

  const onChange = useCallback(
    (e: ChangeEvent<HTMLSelectElement>) => {
      setTheme(e.currentTarget.value)
    },
    [setTheme]
  )

  return (
    <select value={theme} onChange={onChange} className={styles.select}>
      <option value='system'>System</option>
      <option value='dark'>Dark</option>
      <option value='light'>Light</option>
    </select>
  )
}

export default ThemeSwitcher
