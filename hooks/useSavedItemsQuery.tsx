import { useAuth } from '@/context/AuthContext/AuthContext'
import { restClient } from '@/lib/clients/restClient'
import {
    getLocallySavedItemsUnpopulated,
    setLocallySavedItemsUnpopulated,
    populateSavedItems,
} from '@/lib/core/wishlists'
import { DEFAULT_COLLECTION_LIMIT } from '@/lib/utils/constants'
import { SavedItemsData } from '@/types/store'
import { QueryFunctionContext, useInfiniteQuery } from '@tanstack/react-query'
import { useCallback } from 'react'

const useSavedItemsQuery = (limit: number = DEFAULT_COLLECTION_LIMIT) => {
    const { isLoggedIn } = useAuth()

    const getLocallySavedItems = useCallback(
        async (limit: number = DEFAULT_COLLECTION_LIMIT, cursor?: string) => {
            const savedItemsIds = getLocallySavedItemsUnpopulated()
            return populateSavedItems(savedItemsIds, limit, cursor)
        },
        [],
    )

    const getSavedItems = useCallback(
        async (
            limit: number = DEFAULT_COLLECTION_LIMIT,
            cursor?: string,
        ): Promise<SavedItemsData> => {
            const url = `/wishlist?populate=true&sz=${limit}${cursor ? '&cursor=' + cursor : ''}`
            const response = await restClient(url)

            setLocallySavedItemsUnpopulated(response.data.savedItemsIds)

            return response.data
        },
        [],
    )

    const queryFn = useCallback(
        async (context: QueryFunctionContext) => {
            try {
                let response
                if (isLoggedIn) {
                    response = await getSavedItems(
                        limit,
                        context.pageParam ? (context.pageParam as string) : undefined,
                    )
                } else {
                    response = await getLocallySavedItems(
                        limit,
                        context.pageParam ? (context.pageParam as string) : undefined,
                    )
                }

                return response
            } catch (error) {
                throw error
            }
        },
        [limit, isLoggedIn, getSavedItems, getLocallySavedItems],
    )

    return useInfiniteQuery<SavedItemsData>({
        queryKey: ['savedItems'],
        queryFn,
        initialPageParam: undefined,
        getNextPageParam: lastPage => (lastPage.hasNextPage ? lastPage.endCursor : undefined),
    })
}

export default useSavedItemsQuery
