import { useAuth } from '@/context/AuthContext/AuthContext'
import { restClient } from '@/lib/clients/restClient'
import {
    getLocalWishlistUnpopulated,
    populateWishlist,
    setLocalWishlistUnpopulated,
} from '@/lib/core/wishlists'
import { DEFAULT_COLLECTION_LIMIT } from '@/lib/utils/constants'
import { WishlistData } from '@/types/store'
import { useQuery } from '@tanstack/react-query'
import { useCallback } from 'react'

const useWishlist = (limit: number = DEFAULT_COLLECTION_LIMIT) => {
    const { isLoggedIn } = useAuth()

    const getLocalWishlist = useCallback(async (limit: number = DEFAULT_COLLECTION_LIMIT) => {
        const wishlist = getLocalWishlistUnpopulated()
        return populateWishlist(wishlist, limit)
    }, [])

    const getWishlist = useCallback(
        async (limit: number = DEFAULT_COLLECTION_LIMIT): Promise<WishlistData> => {
            const response = await restClient('/wishlist?populate=true&start=' + limit)

            const wishlist = response.data.wishlist
            setLocalWishlistUnpopulated(wishlist)

            return response.data
        },
        [],
    )

    const fetchWishlist = useCallback(async () => {
        try {
            let response
            if (isLoggedIn) {
                response = await getWishlist(limit)
            } else {
                response = await getLocalWishlist(limit)
            }

            return response
        } catch (error) {
            throw error
        }
    }, [limit, isLoggedIn, getLocalWishlist, getWishlist])

    const { data, error, isPending } = useQuery({
        queryKey: ['getWishlist'],
        queryFn: fetchWishlist,
    })

    return { data, error, isPending }
}

export default useWishlist
