import { Avatar } from '@/components/Avatar'
import { Container } from '@/components/Layout'
import { format } from '@lukeed/ms'
import clsx from 'clsx'
import Link from 'next/link'
import { useMemo } from 'react'
import styles from './Post.module.css'
import { Post as PostType } from '@/api-lib/types'

interface PostProps {
  post: PostType
  className?: string
}

const Post: React.FC<PostProps> = ({ post, className }) => {
  const timestampTxt = useMemo(() => {
    const diff = Date.now() - new Date(post.createdAt).getTime()
    if (diff < 1 * 60 * 1000) return 'Just now'
    return `${format(diff, true)} ago`
  }, [post.createdAt])

  return (
    <div className={clsx(styles.root, className)}>
      {post.creator && (
        <Link href={`/user/${post.creator.username}`}>
          <Container className={styles.creator}>
            <Avatar
              size={36}
              url={post.creator.profilePicture}
              username={post.creator.username}
            />
            <Container column className={styles.meta}>
              <p className={styles.username}>{post.creator.username}</p>
            </Container>
          </Container>
        </Link>
      )}
      <div className={styles.wrap}>
        <p className={styles.content}>{post.content}</p>
      </div>
      <div className={styles.wrap}>
        <time dateTime={String(post.createdAt)} className={styles.timestamp}>
          {timestampTxt}
        </time>
      </div>
    </div>
  )
}

export default Post
