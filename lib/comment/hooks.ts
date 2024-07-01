import { fetcher } from '@/lib/fetch'
import useSWRInfinite from 'swr/infinite'

interface Comment {
  createdAt: string // Use the appropriate date type here.
}

interface PageData {
  comments: Comment[]
}

interface CommentPageOptions {
  postId: string
  limit?: number
}

export function useCommentPages(
  { postId, limit = 10 }: CommentPageOptions = {} as CommentPageOptions
) {
  const getKey = (index: number, previousPageData: PageData | null) => {
    // reached the end
    if (previousPageData && previousPageData.comments.length === 0) return null

    const searchParams = new URLSearchParams()
    searchParams.set('limit', limit.toString())

    if (index !== 0 && previousPageData) {
      const before = new Date(
        new Date(
          previousPageData.comments[
            previousPageData.comments.length - 1
          ].createdAt
        ).getTime()
      )

      searchParams.set('before', before.toJSON())
    }

    return `/api/posts/${postId}/comments?${searchParams.toString()}`
  }

  // Type adjustment: Specify that each fetch returns PageData, not an array of PageData.
  const { data, error, size, ...props } = useSWRInfinite<PageData>(
    getKey,
    fetcher,
    {
      refreshInterval: 10000,
      revalidateAll: false
    }
  )

  const isLoadingInitialData = !data && !error
  const isLoadingMore =
    isLoadingInitialData ||
    (size > 0 && data && typeof data[size - 1] === 'undefined')
  const isEmpty = data?.[0]?.comments.length === 0
  const isReachingEnd =
    isEmpty || (data && data[data.length - 1]?.comments?.length < limit)

  return {
    data,
    error,
    size,
    isLoadingMore,
    isReachingEnd,
    ...props
  }
}
