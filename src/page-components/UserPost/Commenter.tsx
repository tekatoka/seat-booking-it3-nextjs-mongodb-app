import { Avatar } from '@/components/Avatar'
import { Button } from '@/components/Button'
import { Input } from '@/components/Input'
import { Container } from '@/components/Layout'
import { LoadingDots } from '@/components/LoadingDots'
import { Text, TextLink } from '@/components/Text'
import { useCommentPages } from '@/lib/comment'
import { fetcher } from '@/lib/fetch'
import { useCurrentUser } from '@/lib/user'
import { useCallback, useRef, useState, FormEvent } from 'react'
import toast from 'react-hot-toast'
import styles from './Commenter.module.css'
import { User, Post as PostType } from '@/api-lib/types' // Ensure this import path is correct

interface CommenterInnerProps {
  user: User
  post: PostType
}

const CommenterInner: React.FC<CommenterInnerProps> = ({ user, post }) => {
  const contentRef = useRef<HTMLInputElement>(null)
  const [isLoading, setIsLoading] = useState(false)

  if (!post._id) {
    throw new Error('Post ID is missing')
  }

  const { mutate } = useCommentPages({ postId: post._id.toString() })

  const onSubmit = useCallback(
    async (e: FormEvent<HTMLFormElement>) => {
      e.preventDefault()
      try {
        setIsLoading(true)
        await fetcher(`/api/posts/${post._id}/comments`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ content: contentRef.current?.value })
        })
        toast.success('You have added a comment')
        if (contentRef.current) {
          contentRef.current.value = ''
        }
        // refresh post lists
        mutate()
      } catch (e: any) {
        toast.error(e.message)
      } finally {
        setIsLoading(false)
      }
    },
    [mutate, post._id]
  )

  return (
    <form onSubmit={onSubmit}>
      <Container className={styles.poster}>
        <Avatar size={40} username={user.username} url={user.profilePicture} />
        <Input
          ref={contentRef}
          className={styles.input}
          placeholder='Add your comment'
          ariaLabel='Add your comment'
        />
        <Button type='submit' variant='secondary' loading={isLoading}>
          Comment
        </Button>
      </Container>
    </form>
  )
}

interface CommenterProps {
  post: PostType
}

const Commenter: React.FC<CommenterProps> = ({ post }) => {
  const { data, error } = useCurrentUser()
  const loading = !data && !error

  return (
    <div className={styles.root}>
      {post.creator && (
        <h3 className={styles.heading}>
          Replying to{' '}
          <TextLink href={`/user/${post.creator.username}`} color='link'>
            @{post.creator.username}
          </TextLink>
        </h3>
      )}
      {loading ? (
        <LoadingDots>Loading</LoadingDots>
      ) : data?.user ? (
        <CommenterInner post={post} user={data.user} />
      ) : (
        <Text color='secondary'>
          Please{' '}
          <TextLink href='/login' color='link' variant='highlight'>
            sign in
          </TextLink>{' '}
          to comment
        </Text>
      )}
    </div>
  )
}

export default Commenter
