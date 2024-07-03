import { Button } from '@/components/Button'
import { Comment } from '@/components/Comment'
import { Container, Spacer } from '@/components/Layout'
import { Text } from '@/components/Text'
import { useCommentPages } from '@/lib/comment'
import styles from './CommentList.module.css'
import { Post as PostType, Comment as CommentType } from '@/api-lib/types' // Ensure this import path is correct

interface CommentListProps {
  post: PostType
}

const CommentList: React.FC<CommentListProps> = ({ post }) => {
  if (!post._id) {
    throw new Error('Post ID is missing')
  }

  const { data, size, setSize, isLoadingMore, isReachingEnd } = useCommentPages(
    {
      postId: post._id?.toString()
    }
  )

  const comments: CommentType[] = data
    ? data.reduce<CommentType[]>((acc, val) => [...acc, ...val.comments], [])
    : []

  return (
    <div className={styles.root}>
      <Spacer axis='vertical' size={1} />
      {comments.map((comment, i) => (
        <div key={i} className={styles.wrap}>
          <Comment className={styles.comment} comment={comment} />
        </div>
      ))}
      <Container justifyContent='center'>
        {isReachingEnd ? (
          <Text color='secondary'>No more comments are found</Text>
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
    </div>
  )
}

export default CommentList
