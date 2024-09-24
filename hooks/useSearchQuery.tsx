import { restClient } from '@/lib/clients/restClient'
import { ProductSearchResults } from '@/types/store'
import { QueryFunctionContext, useInfiniteQuery } from '@tanstack/react-query'

const useSearchQuery = (searchParams: URLSearchParams) => {
    const query = searchParams.get('q') || ''

    return useInfiniteQuery<ProductSearchResults>({
        queryKey: ['getSearch', query, searchParams.toString()],
        queryFn: async (context: QueryFunctionContext) => {
            const url = new URL(process.env.NEXT_PUBLIC_API_URL + '/search')

            if (searchParams.get('q') == undefined) {
                url.searchParams.set('q', '')
            }

            Array.from(searchParams.entries()).forEach(entry => {
                const [key, value] = entry
                url.searchParams.set(key, value)
            })

            const { pageParam } = context
            if (typeof pageParam === 'string') {
                url.searchParams.set('cursor', pageParam)
            }

            try {
                const response = await restClient(url.toString())
                return response.data
            } catch (error) {
                throw error
            }
        },
        initialPageParam: undefined,
        getNextPageParam: lastPage => (lastPage.hasNextPage ? lastPage.endCursor : undefined),
    })
}

export default useSearchQuery
