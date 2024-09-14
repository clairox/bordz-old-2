import { UPDATE_WISHLIST } from '@/lib/graphql/shopify/admin/mutations'
import { getSavedItemsIdsAndCustomerId } from '../storefront/getSavedItemsIdsAndCustomerId'
import { adminClient } from './base'
import _ from 'lodash'

export const removeSavedItems = async (customerAccessToken: string, ids: string[]) => {
    const { savedItemsIds, customerId } = await getSavedItemsIdsAndCustomerId(customerAccessToken)
    const updateData = JSON.stringify(savedItemsIds.filter(id => !ids.includes(id)))

    const config = {
        variables: { customerId, wishlist: updateData },
    }

    try {
        const { metafieldsSet } = await adminClient(UPDATE_WISHLIST, 'metafieldsSet', config)

        const updatedSavedItems = JSON.parse(
            metafieldsSet?.metafields?.[0]?.value || '[]',
        ) as string[]
        if (updatedSavedItems == undefined || !Array.isArray(updatedSavedItems)) {
            throw new Error('updatedSavedItems is not of array type')
        }

        return updatedSavedItems
    } catch (error) {
        throw error
    }
}
