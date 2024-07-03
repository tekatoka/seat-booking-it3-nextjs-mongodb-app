import { Button } from '@/components/Button'
import { Container, Spacer } from '@/components/Layout'
import Wrapper from '@/components/Layout/Wrapper'
import { Post as PostComponent } from '@/components/Post'
import { Text } from '@/components/Text'
import { usePostPages } from '@/lib/post'
import Link from 'next/link'
import styles from './PostList.module.css'
import { Post as PostType } from '@/api-lib/types' // Ensure this import path is correct

const PostList: React.FC = () => {
  const { data, size, setSize, isLoadingMore, isReachingEnd } = usePostPages()

  // Flatten nested posts arrays into a flat array of posts
  const posts: PostType[] = data
    ? data.reduce<PostType[]>(
        (acc, pageData) => [...acc, ...pageData.posts],
        []
      )
    : []

  return (
    <div className={styles.root}>
      <Spacer axis='vertical' size={1} />
      <Wrapper>
        {posts.map(post => (
          <Link
            key={post._id?.toString()}
            href={`/user/${post.creator?.username}/post/${post._id}`}
            passHref
          >
            <div className={styles.wrap}>
              <PostComponent className={styles.post} post={post} />
            </div>
          </Link>
        ))}
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

export default PostList
