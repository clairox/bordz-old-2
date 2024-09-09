import { UPDATE_WISHLIST } from '@/lib/graphql/shopify/admin/mutations'
import { getWishlistAndCustomerId } from '../storefront/getWishlistAndCustomerId'
import { adminClient } from './base'
import _ from 'lodash'

export const addWishlistItems = async (customerAccessToken: string, ids: string[]) => {
    const { wishlistIds, customerId } = await getWishlistAndCustomerId(customerAccessToken)

    const updateData = JSON.stringify(_.uniq(wishlistIds.concat(...ids)))

    const config = {
        variables: { customerId, wishlist: updateData },
    }

    try {
        const { metafieldsSet } = await adminClient(UPDATE_WISHLIST, 'metafieldsSet', config)

        const updatedWishlistItems = JSON.parse(
            metafieldsSet?.metafields?.[0]?.value || '[]',
        ) as string[]
        if (updatedWishlistItems == undefined || !Array.isArray(updatedWishlistItems)) {
            throw new Error('Wishlist is not of array type')
        }

        return updatedWishlistItems
    } catch (error) {
        throw error
    }
}
