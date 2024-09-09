import { REMOVE_CART_LINES } from '@/lib/graphql/shopify/storefront/mutations'
import { storefrontClient } from './base'
import { validateCart } from '@/lib/services/shopify/validators'

export const removeCartLines = async (id: string, lineIds: string[]) => {
    const config = {
        variables: {
            cartId: id,
            lineIds,
        },
    }

    try {
        const { cartLinesRemove } = await storefrontClient(
            REMOVE_CART_LINES,
            'cartLinesRemove',
            config,
        )
        const cart = cartLinesRemove?.cart
        return validateCart(cart)
    } catch (error) {
        throw error
    }
}
