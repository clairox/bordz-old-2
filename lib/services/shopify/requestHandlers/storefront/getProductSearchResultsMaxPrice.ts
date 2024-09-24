import { storefrontClient } from './base'
import { GET_PRODUCT_SEARCH_MAX_PRICE } from '@/lib/graphql/shopify/storefront/queries'
import { roundUp } from '@/lib/utils/number'

export const getProductSearchResultsMaxPrice = async (query: string) => {
    const config = {
        variables: {
            query,
        },
    }

    try {
        const { search } = await storefrontClient(GET_PRODUCT_SEARCH_MAX_PRICE, 'search', config)

        // @ts-ignore
        const maxPrice = Number(search?.nodes[0].priceRange?.maxVariantPrice.amount)
        if (typeof maxPrice !== 'number') {
            throw new Error('maxPrice is not of number type')
        }

        return roundUp(maxPrice)
    } catch (error) {
        throw error
    }
}
