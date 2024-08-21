import { WishlistItem } from '@/types/store'
import { restClient } from '@/lib/services/clients/restClient'

type WishlistData = {
    wishlist: string[]
    populatedWishlist: WishlistItem[]
    hasNextPage: boolean
}

const DEFAULT_LIMIT = 40

export const mergeWishlists = (sourceWishlist: string[], targetWislist: string[]): string[] => {
    const mergedWishlist = new Array(...targetWislist)
    sourceWishlist.forEach(item => {
        if (!targetWislist.includes(item)) {
            mergedWishlist.push(item)
        }
    })

    return mergedWishlist
}

export const getLocalWishlist = (): string[] => JSON.parse(localStorage.getItem('wishlist') || '[]')

const setLocalWishlist = (wishlist: string[]) =>
    localStorage.setItem('wishlist', JSON.stringify(wishlist))

export const addWishlistItem = async (
    item: string,
    limit: number = DEFAULT_LIMIT,
): Promise<WishlistData> => {
    const response = await restClient('/wishlist/items', {
        method: 'POST',
        body: JSON.stringify({ ids: [item], populate: true, start: limit }),
    })

    if (response.ok) {
        const wishlist = response.data.wishlist
        setLocalWishlist(wishlist)

        return response.data
    }

    const wishlist = getLocalWishlist().concat(item)
    setLocalWishlist(wishlist)

    try {
        const response = await restClient('/productVariants', {
            method: 'POST',
            body: JSON.stringify({
                ids: wishlist,
                start: limit,
            }),
        })

        const { productVariants: populatedWishlist, hasNextPage } = response.data
        return { wishlist, populatedWishlist, hasNextPage }
    } catch (error) {
        throw error
    }
}

export const removeWishlistItem = async (
    item: string,
    limit: number = DEFAULT_LIMIT,
): Promise<WishlistData> => {
    const response = await restClient('/wishlist/items', {
        method: 'DELETE',
        body: JSON.stringify({ ids: [item], populate: true, start: limit }),
    })

    if (response.ok) {
        const wishlist = response.data.wishlist
        setLocalWishlist(wishlist)

        return response.data
    }

    const wishlist = getLocalWishlist().filter(wishlistItem => wishlistItem !== item)
    setLocalWishlist(wishlist)

    try {
        const response = await restClient('/productVariants', {
            method: 'POST',
            body: JSON.stringify({
                ids: wishlist,
                start: limit,
            }),
        })

        const { productVariants: populatedWishlist, hasNextPage } = response.data
        return { wishlist, populatedWishlist, hasNextPage }
    } catch (error) {
        throw error
    }
}

export const getWishlist = async (limit: number = DEFAULT_LIMIT): Promise<WishlistData> => {
    const response = await restClient('/wishlist?populate=true&start=' + limit)

    if (response.ok) {
        const wishlist = response.data.wishlist
        setLocalWishlist(wishlist)

        return response.data
    }

    const wishlist = getLocalWishlist()
    try {
        const response = await restClient('/productVariants', {
            method: 'POST',
            body: JSON.stringify({
                ids: wishlist,
                start: limit,
            }),
        })

        const { productVariants: populatedWishlist, hasNextPage } = response.data
        return { wishlist, populatedWishlist, hasNextPage }
    } catch (error) {
        throw error
    }
}
