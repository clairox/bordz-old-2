import { CartLineUpdateInput } from '@/__generated__/storefront/graphql'
import { UPDATE_CART_LINES } from '@/lib/graphql/shopify/storefront/mutations'
import { storefrontClient } from './base'
import { validateCart } from '@/lib/services/shopify/validators'

export const updateCartLines = async (id: string, lines: CartLineUpdateInput[]) => {
    const config = {
        variables: {
            cartId: id,
            lines,
        },
    }

    try {
        const { cartLinesUpdate } = await storefrontClient(
            UPDATE_CART_LINES,
            'cartLinesUpdate',
            config,
        )
        const cart = cartLinesUpdate?.cart
        return validateCart(cart)
    } catch (error) {
        throw error
    }
}
