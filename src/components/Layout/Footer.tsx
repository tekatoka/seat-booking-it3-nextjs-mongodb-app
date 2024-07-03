import { Text, TextLink } from '@/components/Text'
import styles from './Footer.module.css'
import Wrapper from './Wrapper'

const Footer: React.FC = () => {
  return (
    <footer className={styles.footer}>
      <Wrapper>
        <Text color='accents-7'>
          &copy; IT-3{' '}
          <TextLink href='https://www.ibb.de/' color='link' target='_blank'>
            Investitionsbank Berlin
          </TextLink>
        </Text>
      </Wrapper>
    </footer>
  )
}

export default Footer
