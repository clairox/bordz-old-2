'use client'
import { restClient } from '@/lib/clients/restClient'
import { QueryFunctionContext, useInfiniteQuery } from '@tanstack/react-query'
import { useCallback } from 'react'
import { Collection } from '@/types/store'

const useCollectionQuery = (handle: string, searchParams: URLSearchParams) => {
    const queryKey = ['getCollection', handle, searchParams.toString()]

    const queryFn = useCallback(
        async (context: QueryFunctionContext) => {
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
        [searchParams, handle],
    )

    return useInfiniteQuery<Collection>({
        queryKey,
        queryFn,
        initialPageParam: undefined,
        getNextPageParam: lastPage => (lastPage.hasNextPage ? lastPage.endCursor : undefined),
    })
}

export default useCollectionQuery
