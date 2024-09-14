import { GET_WISHLIST } from '@/lib/graphql/shopify/storefront/queries'
import _ from 'lodash'
import { storefrontClient } from './base'

export const getSavedItemsIdsAndCustomerId = async (
    customerAccessToken: string,
): Promise<{ savedItemsIds: string[]; customerId: string }> => {
    const config = {
        variables: { customerAccessToken },
    }

    try {
        const { customer } = await storefrontClient(GET_WISHLIST, 'customer', config)

        const savedItemsIds = JSON.parse(customer?.metafield?.value || '[]') as string[]
        if (savedItemsIds == undefined || !Array.isArray(savedItemsIds)) {
            throw new Error('savedItemsIds is not of array type')
        }

        const customerId = customer?.id
        if (typeof customerId !== 'string') {
            throw new Error('customerId is not of string type')
        }

        return { savedItemsIds, customerId }
    } catch (error) {
        throw error
    }
}
