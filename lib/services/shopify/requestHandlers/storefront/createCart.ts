import { CREATE_CART } from '@/lib/graphql/shopify/storefront/mutations'
import { storefrontClient } from './base'
import { validateCart } from '@/lib/services/shopify/validators'

export const createCart = async () => {
    try {
        const { cartCreate } = await storefrontClient(CREATE_CART, 'cartCreate')
        return validateCart(cartCreate?.cart)
    } catch (error) {
        throw error
    }
}
