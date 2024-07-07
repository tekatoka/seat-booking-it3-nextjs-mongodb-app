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
        <title>IT-3 Sitzplatz App</title>
        <meta
          key='viewport'
          name='viewport'
          content='width=device-width, initial-scale=1, shrink-to-fit=no'
        />
        <meta
          name='description'
          content='nextjs-mongodb-app is a continuously developed app built with Next.JS and MongoDB. This project goes further and attempts to integrate top features as seen in real-life apps.'
        />
        <meta property='og:title' content='Next.js + MongoDB App' />
        <meta
          property='og:description'
          content='nextjs-mongodb-app is a continuously developed app built with Next.JS and MongoDB. This project goes further and attempts to integrate top features as seen in real-life apps.'
        />
        <meta
          property='og:image'
          content='https://repository-images.githubusercontent.com/201392697/5d392300-eef3-11e9-8e20-53310193fbfd'
        />
      </Head>
      <Nav />
      <main className={styles.main}>{children}</main>
      <Footer />
    </>
  )
}

export default Layout
