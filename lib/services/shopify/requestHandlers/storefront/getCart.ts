import { GET_CART } from '@/lib/graphql/shopify/storefront/queries'
import { storefrontClient } from './base'
import { validateCart } from '@/lib/services/shopify/validators'

export const getCart = async (id: string) => {
    const config = {
        variables: { id },
        cache: 'no-cache' as RequestCache,
    }

    try {
        const { cart } = await storefrontClient(GET_CART, 'cart', config)
        return validateCart(cart)
    } catch (error) {
        throw error
    }
}
