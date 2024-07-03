import { findPostById } from '@/api-lib/db'
import { getMongoDb } from '@/api-lib/mongodb'
import UserPost from '@/page-components/UserPost'
import Head from 'next/head'
import { GetServerSideProps } from 'next'
import { Post as PostType } from '@/api-lib/types'

interface UserPostPageProps {
  post: PostType & {
    _id: string
    creatorId: string
    createdAt: string
    creator: { _id: string }
  }
}

const UserPostPage: React.FC<UserPostPageProps> = ({ post }) => {
  return (
    <>
      <Head>
        <title>
          {post.creator.name} ({post.creator.username}): {post.content}
        </title>
      </Head>
      <UserPost post={post} />
    </>
  )
}

export const getServerSideProps: GetServerSideProps = async context => {
  const db = await getMongoDb()

  const post = await findPostById(db, context.params?.postId as string)
  if (!post) {
    return {
      notFound: true
    }
  }

  if (context.params?.username !== post.creator?.username) {
    // mismatch params in url, redirect to correct one
    // eg. post x belongs to user a, but url is /user/b/post/x
    return {
      redirect: {
        destination: `/user/${post.creator?.username}/post/${post._id}`,
        permanent: false
      }
    }
  }

  const transformedPost = {
    ...post,
    _id: post._id?.toString() || '',
    creatorId: post.creatorId?.toString() || '',
    creator: {
      ...post.creator,
      _id: post.creator?._id?.toString() || ''
    },
    createdAt: post.createdAt.toJSON()
  }

  return { props: { post: transformedPost } }
}

export default UserPostPage
