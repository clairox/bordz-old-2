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

const useWishlistMutations = (limit: number = DEFAULT_COLLECTION_LIMIT) => {
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

    const addWishlistItemMutation = useMutation({
        mutationFn: async (item: string) => {
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
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ['getWishlist'] }),
    })

    const removeWishlistItemMutation = useMutation({
        mutationFn: async (item: string) => {
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
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ['getWishlist'] }),
    })

    return {
        addWishlistItem: addWishlistItemMutation,
        removeWishlistItem: removeWishlistItemMutation,
    }
}

export { useWishlistMutations }
