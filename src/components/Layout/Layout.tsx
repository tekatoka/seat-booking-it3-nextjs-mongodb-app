import Head from 'next/head'
import Footer from './Footer'
import styles from './Layout.module.css'
import Nav from './Nav'
import { ReactNode } from 'react'

interface LayoutProps {
  children: ReactNode
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <>
      <Head>
        <title>IT-3 Sitzplatzbuchung-App</title>
        <meta
          key='viewport'
          name='viewport'
          content='width=device-width, initial-scale=1, shrink-to-fit=no'
        />
        <meta
          name='description'
          content='Wir verlosen unsere Plätz jeden Tag neu! :)'
        />
        <meta property='og:title' content='IT-3 Sitzplatzbuchung-App' />
        <meta
          property='og:description'
          content='Wir verlosen unsere Plätz jeden Tag neu! :)'
        />
        <meta property='og:image' content='/images/logo-booking-app.svg' />
      </Head>
      <Nav />
      <main className={styles.main}>{children}</main>
      <Footer />
    </>
  )
}

export default Layout
