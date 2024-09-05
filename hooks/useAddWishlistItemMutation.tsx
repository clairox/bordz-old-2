import { useAuth } from '@/context/AuthContext/AuthContext'
import { queryClient } from '@/lib/clients/queryClient'
import { restClient } from '@/lib/clients/restClient'
import {
    getLocalWishlistUnpopulated,
    populateWishlist,
    setLocalWishlistUnpopulated,
} from '@/lib/core/wishlists'
import { DEFAULT_COLLECTION_LIMIT } from '@/lib/utils/constants'
import { WishlistData } from '@/types/store'
import { useMutation } from '@tanstack/react-query'
import { useCallback } from 'react'

const useAddWishlistItemMutation = () => {
    const { isLoggedIn } = useAuth()

    const addLocalWishlistItem = useCallback(
        async (item: string, limit: number = DEFAULT_COLLECTION_LIMIT): Promise<WishlistData> => {
            const wishlist = getLocalWishlistUnpopulated().concat(item)
            setLocalWishlistUnpopulated(wishlist)

            return populateWishlist(wishlist, limit)
        },
        [],
    )

    const addWishlistItem = useCallback(
        async (item: string, limit: number = DEFAULT_COLLECTION_LIMIT): Promise<WishlistData> => {
            try {
                const response = await restClient('/wishlist/items', {
                    method: 'POST',
                    body: JSON.stringify({ ids: [item], populate: true, start: limit }),
                })

                const wishlist = response.data.wishlist
                setLocalWishlistUnpopulated(wishlist)

                return response.data
            } catch (error) {
                throw error
            }
        },
        [],
    )

    type AddWishlistItemVariables = {
        item: string
        limit?: number
    }

    const mutationFn = useCallback(
        async ({ item, limit = DEFAULT_COLLECTION_LIMIT }: AddWishlistItemVariables) => {
            try {
                let response
                if (isLoggedIn) {
                    response = await addWishlistItem(item, limit)
                } else {
                    response = await addLocalWishlistItem(item, limit)
                }

                return response
            } catch (error) {
                throw error
            }
        },
        [addLocalWishlistItem, addWishlistItem, isLoggedIn],
    )

    return useMutation({
        mutationFn,
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ['getWishlist'] }),
    })
}

export default useAddWishlistItemMutation
