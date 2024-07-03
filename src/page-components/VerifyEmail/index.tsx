import { ButtonLink } from '@/components/Button'
import { Container, Spacer, Wrapper } from '@/components/Layout'
import { Text } from '@/components/Text'

import styles from './VerifyEmail.module.css'

interface VerifyEmailProps {
  valid: boolean
}

const VerifyEmail: React.FC<VerifyEmailProps> = ({ valid }) => {
  return (
    <Wrapper className={styles.root}>
      <Container column alignItems='center'>
        <Text
          className={styles.text}
          color={valid ? 'success-light' : 'secondary'}
        >
          {valid
            ? 'Thank you for verifying your email address. You may close this page.'
            : 'It looks like you may have clicked on an invalid link. Please close this window and try again.'}
        </Text>
        <Spacer size={4} axis='vertical' />
        <ButtonLink href='/' variant='ghost' type='success' size='large'>
          Go back home
        </ButtonLink>
      </Container>
    </Wrapper>
  )
}

export default VerifyEmail
