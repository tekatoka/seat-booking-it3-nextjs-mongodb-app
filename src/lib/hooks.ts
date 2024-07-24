import { useTheme } from 'next-themes'

interface Colors {
  foregroundColor: string
  backgroundColor: string
}

const useColors = (): Colors => {
  const { theme } = useTheme()
  const colors: Colors = {
    foregroundColor: theme === 'dark' ? '#ffffff' : '#000000',
    backgroundColor: theme === 'dark' ? '#000000' : '#ffffff'
  }

  return colors
}

export default useColors
