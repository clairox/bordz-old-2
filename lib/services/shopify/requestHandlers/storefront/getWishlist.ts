import { GET_WISHLIST } from '@/lib/graphql/shopify/storefront/queries'
import { storefrontClient } from './base'

export const getWishlist = async (customerAccessToken: string) => {
    const config = {
        variables: { customerAccessToken },
        cache: 'no-cache' as RequestCache,
    }
    try {
        const { customer } = await storefrontClient(GET_WISHLIST, 'customer', config)

        const wishlistIds = JSON.parse(customer?.metafield?.value || '[]') as string[]
        if (wishlistIds == undefined || !Array.isArray(wishlistIds)) {
            throw new Error('Wishlist is not of array type')
        }

        return wishlistIds
    } catch (error) {
        throw error
    }
}
