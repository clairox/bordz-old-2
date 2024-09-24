import { storefrontClient } from './base'
import { GET_COLLECTION_MAX_PRICE } from '@/lib/graphql/shopify/storefront/queries'
import { roundUp } from '@/lib/utils/number'

export const getCollectionMaxPrice = async (handle: string) => {
    const config = {
        variables: {
            handle,
        },
    }

    try {
        const { collection } = await storefrontClient(
            GET_COLLECTION_MAX_PRICE,
            'collection',
            config,
        )

        const maxPrice = Number(collection?.products.nodes[0].priceRange.maxVariantPrice.amount)
        if (typeof maxPrice !== 'number') {
            throw new Error('maxPrice is not of number type')
        }

        return roundUp(maxPrice)
    } catch (error) {
        throw error
    }
}
