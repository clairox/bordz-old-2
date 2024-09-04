import { useAuth } from '@/context/AuthContext/AuthContext'
import { restClient } from '@/lib/clients/restClient'
import {
    getLocalWishlistUnpopulated,
    populateWishlist,
    setLocalWishlistUnpopulated,
} from '@/lib/core/wishlists'
import { DEFAULT_COLLECTION_LIMIT } from '@/lib/utils/constants'
import { WishlistData } from '@/types/store'
import { QueryFunctionContext, useInfiniteQuery } from '@tanstack/react-query'
import { useCallback } from 'react'

const useWishlist = (limit: number = DEFAULT_COLLECTION_LIMIT) => {
    const { isLoggedIn } = useAuth()

    const getLocalWishlist = useCallback(
        async (limit: number = DEFAULT_COLLECTION_LIMIT, cursor?: string) => {
            const wishlist = getLocalWishlistUnpopulated()
            return populateWishlist(wishlist, limit, cursor)
        },
        [],
    )

    const getWishlist = useCallback(
        async (
            limit: number = DEFAULT_COLLECTION_LIMIT,
            cursor?: string,
        ): Promise<WishlistData> => {
            const url = `/wishlist?populate=true&sz=${limit}${cursor ? '&cursor=' + cursor : ''}`
            const response = await restClient(url)

            const wishlist = response.data.wishlist
            setLocalWishlistUnpopulated(wishlist)

            return response.data
        },
        [],
    )

    const fetchWishlist = useCallback(
        async (context: QueryFunctionContext) => {
            try {
                let response
                if (isLoggedIn) {
                    response = await getWishlist(
                        limit,
                        context.pageParam ? context.pageParam : undefined,
                    )
                } else {
                    response = await getLocalWishlist(
                        limit,
                        context.pageParam ? context.pageParam : undefined,
                    )
                }

                return response
            } catch (error) {
                throw error
            }
        },
        [limit, isLoggedIn, getLocalWishlist, getWishlist],
    )

    const { data, error, fetchNextPage, hasNextPage, isFetching, isFetchingNextPage, status } =
        useInfiniteQuery<WishlistData>({
            queryKey: ['getWishlist'],
            queryFn: fetchWishlist,
            initialPageParam: undefined,
            getNextPageParam: lastPage => (lastPage.hasNextPage ? lastPage.endCursor : undefined),
        })

    return { data, error, fetchNextPage, hasNextPage, isFetching, isFetchingNextPage, status }
}

export default useWishlist
