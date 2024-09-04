import { restClient } from '@/lib/clients/restClient'
import { WishlistData } from '@/types/store'

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

export const populateWishlist = async (
    wishlist: string[],
    limit: number = DEFAULT_LIMIT,
    cursor?: string,
): Promise<WishlistData> => {
    try {
        const response = await restClient('/productVariants', {
            method: 'POST',
            body: JSON.stringify({
                ids: wishlist,
                sz: limit,
                cursor,
            }),
        })

        const { productVariants: populatedWishlist, hasNextPage, endCursor } = response.data
        return { wishlist, populatedWishlist, hasNextPage, endCursor }
    } catch (error) {
        throw error
    }
}

export const getLocalWishlistUnpopulated = (): string[] =>
    JSON.parse(localStorage.getItem('wishlist') || '[]')

export const setLocalWishlistUnpopulated = (wishlist: string[]) =>
    localStorage.setItem('wishlist', JSON.stringify(wishlist))

export const isItemInWishlist = (item: string): boolean => {
    return getLocalWishlistUnpopulated().includes(item)
}
