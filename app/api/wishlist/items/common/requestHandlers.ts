import { GET_VARIANTS } from '@/lib/adminAPI/query'
import { GET_WISHLIST } from '@/lib/storefrontAPI/queries'
import {
    adminAPIFetcher,
    checkGraphQLErrors,
    checkUserErrors,
    storefrontAPIFetcher,
} from '@/lib/fetcher/fetcher'
import { toSafeVariant } from './validators'
import { extractResourceId } from '@/lib/utils/ids'
import { UPDATE_WISHLIST } from '@/lib/adminAPI/mutations'
import _ from 'lodash'

const getWishlistIdsAndCustomerId = async (
    customerAccessToken: string,
): Promise<{ wishlistIds: string[]; customerId: string }> => {
    try {
        const { data, errors } = await storefrontAPIFetcher(GET_WISHLIST, {
            variables: { customerAccessToken },
        })

        checkGraphQLErrors(errors)

        const wishlistIds = JSON.parse(data?.customer?.metafield?.value || '[]') as string[]
        if (wishlistIds == undefined || !Array.isArray(wishlistIds)) {
            throw new Error('Wishlist is not of array type')
        }

        const customerId = data?.customer?.id
        if (typeof customerId !== 'string') {
            throw new Error('Customer id is not of string type')
        }

        return { wishlistIds, customerId }
    } catch (error) {
        throw error
    }
}

export const addWishlistItems = async (customerAccessToken: string, ids: string[]) => {
    try {
        const { wishlistIds, customerId } = await getWishlistIdsAndCustomerId(customerAccessToken)
        const updateData = JSON.stringify(_.uniq(wishlistIds.concat(ids)))

        const { data, errors } = await adminAPIFetcher(UPDATE_WISHLIST, {
            variables: { customerId, wishlist: updateData },
        })

        checkGraphQLErrors(errors)
        checkUserErrors(data?.metafieldsSet?.userErrors)

        const updatedWishlistItems = JSON.parse(
            data?.metafieldsSet?.metafields?.[0]?.value || '[]',
        ) as string[]
        if (updatedWishlistItems == undefined || !Array.isArray(updatedWishlistItems)) {
            throw new Error('Wishlist is not of array type')
        }

        return updatedWishlistItems
    } catch (error) {
        throw error
    }
}

export const removeWishlistItems = async (customerAccessToken: string, ids: string[]) => {
    try {
        const { wishlistIds, customerId } = await getWishlistIdsAndCustomerId(customerAccessToken)
        const updateData = JSON.stringify(wishlistIds.filter(id => !ids.includes(id)))

        const { data, errors } = await adminAPIFetcher(UPDATE_WISHLIST, {
            variables: { customerId, wishlist: updateData },
        })

        checkGraphQLErrors(errors)
        checkUserErrors(data?.metafieldsSet?.userErrors)

        const updatedWishlistItems = JSON.parse(
            data?.metafieldsSet?.metafields?.[0]?.value || '[]',
        ) as string[]
        if (updatedWishlistItems == undefined || !Array.isArray(updatedWishlistItems)) {
            throw new Error('Wishlist is not of array type')
        }

        return updatedWishlistItems
    } catch (error) {
        throw error
    }
}

export const populateWishlist = async (ids: string[], limit: number) => {
    const variantQueryString = ids.map(id => 'id:' + extractResourceId(id)).join(' OR ')
    const variables = {
        query: variantQueryString,
        limit,
    }

    try {
        const { data, errors } = await adminAPIFetcher(GET_VARIANTS, { variables })

        checkGraphQLErrors(errors)

        const items = data?.productVariants.nodes
        if (!Array.isArray(items)) {
            throw new Error('Variants are not of array type')
        }

        const safeVariants = items.map(item => toSafeVariant(item))

        const hasNextPage = data?.productVariants?.pageInfo.hasNextPage
        if (typeof hasNextPage !== 'boolean') {
            throw new Error('hasNextPage is not of boolean type')
        }

        return { wishlistItems: safeVariants, hasNextPage }
    } catch (error) {
        throw error
    }
}
