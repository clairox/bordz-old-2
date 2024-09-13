import { infiniteQueryOptions } from '@tanstack/react-query'
import { restClient } from '@/lib/clients/restClient'
import { QueryFunctionContext } from '@tanstack/react-query'
import { Collection } from '@/types/store'

export const getCollectionQueryOptions = (handle: string, searchParams: URLSearchParams) => {
    return infiniteQueryOptions<Collection>({
        queryKey: ['getCollection', handle, searchParams.toString()],
        queryFn: async (context: QueryFunctionContext) => {
            const url = new URL(process.env.NEXT_PUBLIC_API_URL + '/collection')
            url.searchParams.set('handle', handle)

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
