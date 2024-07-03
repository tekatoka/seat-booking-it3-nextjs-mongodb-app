import { ButtonLink } from '@/components/Button'
import { Container, Spacer, Wrapper } from '@/components/Layout'
import styles from './Hero.module.css'

const Hero: React.FC = () => {
  return (
    <Wrapper>
      <div>
        <h1 className={styles.title}>
          <span className={styles.nextjs}>Next.js</span>
          <span className={styles.mongodb}>MongoDB</span>
          <span>App</span>
        </h1>
        <Container justifyContent='center' className={styles.buttons}>
          <Container>
            <ButtonLink href='/feed' className={styles.button}>
              Explore Feed
            </ButtonLink>
          </Container>
          <Spacer axis='horizontal' size={1} />
          <Container>
            <ButtonLink
              href='https://github.com/hoangvvo/nextjs-mongodb-app'
              type='button'
              variant='secondary'
              className={styles.button}
            >
              GitHub
            </ButtonLink>
          </Container>
        </Container>
        <p className={styles.subtitle}>
          A Next.js and MongoDB web application, designed with simplicity for
          learning and real-world applicability in mind.
        </p>
      </div>
    </Wrapper>
  )
}

export default Hero
