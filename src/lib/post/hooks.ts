import { fetcher } from '@/lib/fetch'
import useSWRInfinite from 'swr/infinite'
import { Post as PostType } from '@/api-lib/types' // Ensure this import path is correct

interface PageData {
  posts: PostType[]
}

interface PostPageOptions {
  creatorId?: string
  limit?: number
}

export function usePostPages(
  { creatorId, limit = 10 }: PostPageOptions = {} as PostPageOptions
) {
  const getKey = (
    index: number,
    previousPageData: PageData | null
  ): string | null => {
    if (previousPageData && previousPageData.posts.length === 0) return null

    const searchParams = new URLSearchParams()
    searchParams.set('limit', limit.toString())

    if (creatorId) searchParams.set('by', creatorId)

    if (index !== 0 && previousPageData) {
      const lastPostDate = new Date(
        new Date(
          previousPageData.posts[previousPageData.posts.length - 1].createdAt
        ).getTime()
      )
      searchParams.set('before', lastPostDate.toJSON())
    }

    return `/api/posts?${searchParams.toString()}`
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
  const isEmpty = data?.[0]?.posts.length === 0
  const isReachingEnd =
    isEmpty || (data && data[data.length - 1]?.posts?.length < limit)

  return {
    data,
    error,
    size,
    isLoadingMore,
    isReachingEnd,
    ...props
  }
}
