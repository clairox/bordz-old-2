import { CartLineInput } from '@/__generated__/storefront/graphql'
import { validateCart } from '@/lib/services/shopify/validators'
import { storefrontClient } from './base'
import { ADD_CART_LINES } from '@/lib/graphql/shopify/storefront/mutations'

export const addCartLines = async (id: string, lines: CartLineInput[]) => {
    const config = {
        variables: {
            cartId: id,
            lines,
        },
    }

    try {
        const { cartLinesAdd } = await storefrontClient(ADD_CART_LINES, 'cartLinesAdd', config)
        const cart = cartLinesAdd?.cart
        return validateCart(cart)
    } catch (error) {
        throw error
    }
}
