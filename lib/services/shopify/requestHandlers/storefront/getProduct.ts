import { GET_PRODUCT } from '@/lib/graphql/shopify/storefront/queries'
import { storefrontClient } from './base'
import { validateProduct } from '@/lib/services/shopify/validators'

export const getProduct = async (handle: string) => {
    const config = {
        variables: { handle },
    }
    try {
        const { productByHandle: product } = await storefrontClient(
            GET_PRODUCT,
            'productByHandle',
            config,
        )
        return validateProduct(product)
    } catch (error) {
        throw error
    }
}
