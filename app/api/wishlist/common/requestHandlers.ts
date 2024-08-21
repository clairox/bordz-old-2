import { GET_VARIANTS } from '@/lib/graphql/shopify/admin/queries'
import {
    adminAPIClient,
    checkGraphQLErrors,
    storefrontAPIClient,
} from '@/lib/services/clients/graphqlClient'
import { extractResourceId } from '@/lib/utils/ids'
import { toSafeVariant } from './validators'
import { GET_WISHLIST } from '@/lib/graphql/shopify/storefront/queries'

export const getWishlist = async (customerAccessToken: string) => {
    try {
        const { data, errors } = await storefrontAPIClient(GET_WISHLIST, {
            variables: { customerAccessToken },
        })

        checkGraphQLErrors(errors)

        const wishlistIds = JSON.parse(data?.customer?.metafield?.value || '[]') as string[]
        if (wishlistIds == undefined || !Array.isArray(wishlistIds)) {
            throw new Error('Wishlist is not of array type')
        }

        return wishlistIds
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
        const { data, errors } = await adminAPIClient(GET_VARIANTS, { variables })

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
