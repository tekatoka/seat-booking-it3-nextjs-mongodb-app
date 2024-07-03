import { Button } from '@/components/Button'
import { Container, Spacer } from '@/components/Layout'
import Wrapper from '@/components/Layout/Wrapper'
import { Post } from '@/components/Post'
import { Text } from '@/components/Text'
import { usePostPages } from '@/lib/post'
import Link from 'next/link'
import styles from './UserPosts.module.css'
import { User as UserType, Post as PostType } from '@/api-lib/types'

interface UserPostsProps {
  user: UserType
}

const UserPosts: React.FC<UserPostsProps> = ({ user }) => {
  const { data, size, setSize, isLoadingMore, isReachingEnd } = usePostPages({
    creatorId: user._id?.toString()
  })
  const posts: PostType[] = data
    ? data.reduce<PostType[]>((acc, val) => [...acc, ...val.posts], [])
    : []

  return (
    <div className={styles.root}>
      <Spacer axis='vertical' size={1} />
      <Wrapper>
        {posts.map(
          (post, i) =>
            post.creator && (
              <Link
                key={i}
                href={`/user/${post.creator.username}/post/${post._id}`}
                className={styles.wrap}
              >
                <Post className={styles.post} post={post} />
              </Link>
            )
        )}
        <Container justifyContent='center'>
          {isReachingEnd ? (
            <Text color='secondary'>No more posts are found</Text>
          ) : (
            <Button
              variant='secondary'
              type='button'
              loading={isLoadingMore}
              onClick={() => setSize(size + 1)}
            >
              Load more
            </Button>
          )}
        </Container>
      </Wrapper>
    </div>
  )
}

export default UserPosts
