import { useAuth } from '@/context/AuthContext/AuthContext'
import { restClient } from '@/lib/clients/restClient'
import {
    getLocalWishlistUnpopulated,
    populateWishlist,
    setLocalWishlistUnpopulated,
} from '@/lib/core/wishlists'
import { DEFAULT_COLLECTION_LIMIT } from '@/lib/utils/constants'
import { WishlistData } from '@/types/store'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useCallback } from 'react'

const useRemoveWishlistItemMutation = () => {
    const { isLoggedIn } = useAuth()
    const queryClient = useQueryClient()

    const removeLocalWishlistItem = useCallback(
        async (item: string, limit: number = DEFAULT_COLLECTION_LIMIT): Promise<WishlistData> => {
            const wishlist = getLocalWishlistUnpopulated().filter(
                wishlistItem => wishlistItem !== item,
            )
            setLocalWishlistUnpopulated(wishlist)

            return populateWishlist(wishlist, limit)
        },
        [],
    )

    const removeWishlistItem = useCallback(
        async (item: string, limit: number = DEFAULT_COLLECTION_LIMIT): Promise<WishlistData> => {
            try {
                const response = await restClient('/wishlist/items', {
                    method: 'DELETE',
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

    type UseRemoveWishlistItemVariables = {
        item: string
        limit?: number
    }

    const mutationFn = useCallback(
        async ({ item, limit = DEFAULT_COLLECTION_LIMIT }: UseRemoveWishlistItemVariables) => {
            try {
                let response
                if (isLoggedIn) {
                    response = await removeWishlistItem(item, limit)
                } else {
                    response = await removeLocalWishlistItem(item, limit)
                }

                return response
            } catch (error) {
                throw error
            }
        },
        [removeWishlistItem, removeLocalWishlistItem, isLoggedIn],
    )

    return useMutation({
        mutationFn,
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ['getWishlist'] }),
    })
}

export default useRemoveWishlistItemMutation
