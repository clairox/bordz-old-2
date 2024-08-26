import { makeProductFilters } from '@/lib/utils/helpers'
import { storefrontClient } from './base'
import { GET_COLLECTION_MAX_PRICE } from '@/lib/graphql/shopify/storefront/queries'

export const getCollectionMaxPrice = async (
    handle: string,
    filterGroups: Record<string, string[]>,
) => {
    const filters = makeProductFilters(filterGroups)

    const config = {
        variables: {
            handle,
            filters,
        },
    }

    try {
        const { collection } = await storefrontClient(
            GET_COLLECTION_MAX_PRICE,
            'collection',
            config,
        )
        const maxPrice = collection?.products.nodes.reduce((previousPrice, currentProduct) => {
            const currentPrice = Number(currentProduct.priceRange.maxVariantPrice.amount)
            if (currentPrice > previousPrice) {
                return currentPrice
            }

            return previousPrice
        }, 0)

        if (typeof maxPrice !== 'number') {
            throw new Error('maxPrice is not of number type')
        }

        return maxPrice
    } catch (error) {
        throw error
    }
}
