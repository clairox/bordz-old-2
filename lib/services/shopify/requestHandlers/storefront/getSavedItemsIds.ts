import { GET_WISHLIST } from '@/lib/graphql/shopify/storefront/queries'
import { storefrontClient } from './base'

export const getSavedItemsIds = async (customerAccessToken: string) => {
    const config = {
        variables: { customerAccessToken },
        cache: 'no-cache' as RequestCache,
    }
    try {
        const { customer } = await storefrontClient(GET_WISHLIST, 'customer', config)

        const savedItemsIds = JSON.parse(customer?.metafield?.value || '[]') as string[]
        if (savedItemsIds == undefined || !Array.isArray(savedItemsIds)) {
            throw new Error('savedItemsIds is not of array type')
        }

        return savedItemsIds
    } catch (error) {
        throw error
    }
}
