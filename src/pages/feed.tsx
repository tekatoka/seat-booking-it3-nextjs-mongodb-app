import { FC } from 'react'
import { Feed } from '@/page-components/Feed'
import Head from 'next/head'

const FeedPage: FC = () => {
  return (
    <>
      <Head>
        <title>Feed</title>
      </Head>
      <Feed />
    </>
  )
}

export default FeedPage
