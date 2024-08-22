import { GET_WISHLIST } from '@/lib/graphql/shopify/storefront/queries'
import _ from 'lodash'
import { storefrontClient } from './base'

export const getWishlistAndCustomerId = async (
    customerAccessToken: string,
): Promise<{ wishlistIds: string[]; customerId: string }> => {
    const config = {
        variables: { customerAccessToken },
    }

    try {
        const { customer } = await storefrontClient(GET_WISHLIST, 'customer', config)

        const wishlistIds = JSON.parse(customer?.metafield?.value || '[]') as string[]
        if (wishlistIds == undefined || !Array.isArray(wishlistIds)) {
            throw new Error('Wishlist is not of array type')
        }

        const customerId = customer?.id
        if (typeof customerId !== 'string') {
            throw new Error('Customer id is not of string type')
        }

        return { wishlistIds, customerId }
    } catch (error) {
        throw error
    }
}
