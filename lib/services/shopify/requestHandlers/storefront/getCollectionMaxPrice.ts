import { makeProductFilters } from '@/lib/utils/helpers'
import { storefrontClient } from './base'
import { GET_COLLECTION_MAX_PRICE } from '@/lib/graphql/shopify/storefront/queries'

export const getCollectionMaxPrice = async (
    handle: string,
    subcategory?: string,
    limit: number = 40,
    brands: string[] = [],
    sizes: string[] = [],
    colors: string[] = [],
) => {
    const filters = makeProductFilters({
        subcategory,
        brands,
        sizes,
        colors,
        price: [], // NOTE price filter should not influence max price
    })

    const config = {
        variables: {
            handle,
            limit,
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
