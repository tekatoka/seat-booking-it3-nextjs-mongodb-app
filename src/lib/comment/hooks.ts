import { fetcher } from '@/lib/fetch'
import useSWRInfinite from 'swr/infinite'
import { Comment as CommentType } from '@/api-lib/types' // Ensure this import path is correct

interface PageData {
  comments: CommentType[]
}

interface CommentPageOptions {
  postId: string
  limit?: number
}

export function useCommentPages({ postId, limit = 10 }: CommentPageOptions) {
  const getKey = (index: number, previousPageData: PageData | null) => {
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
