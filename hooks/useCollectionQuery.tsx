'use client'
import { restClient } from '@/lib/clients/restClient'
import { useParams } from 'next/navigation'
import { QueryFunctionContext, useInfiniteQuery } from '@tanstack/react-query'
import { useCallback } from 'react'
import { Collection } from '@/types/store'

const useCollectionQuery = (searchParams: URLSearchParams) => {
    const params = useParams()
    const queryKey = ['getCollection', searchParams.toString()]

    const queryFn = useCallback(
        async (context: QueryFunctionContext) => {
            const [handle] = params.collection as string[]
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
        [searchParams, params],
    )

    return useInfiniteQuery<Collection>({
        queryKey,
        queryFn,
        initialPageParam: undefined,
        getNextPageParam: lastPage => (lastPage.hasNextPage ? lastPage.endCursor : undefined),
    })
}

export default useCollectionQuery
