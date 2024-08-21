import {
    checkGraphQLErrors,
    checkUserErrors,
    storefrontAPIClient,
} from '@/lib/services/clients/graphqlClient'
import {
    ADD_CART_LINES,
    REMOVE_CART_LINES,
    UPDATE_CART_LINES,
} from '@/lib/graphql/shopify/storefront/mutations'
import { toSafeCart } from './validators'
import { CartLineInput, CartLineUpdateInput } from '@/__generated__/storefront/graphql'

export const addCartLine = async (id: string, lines: CartLineInput[]) => {
    const variables = {
        cartId: id,
        lines,
    }

    try {
        const { data, errors } = await storefrontAPIClient(ADD_CART_LINES, { variables })

        checkGraphQLErrors(errors)
        checkUserErrors(data?.cartLinesAdd?.userErrors)

        const cart = data?.cartLinesAdd?.cart
        const safeCart = toSafeCart(cart)

        return safeCart
    } catch (error) {
        throw error
    }
}

export const updateCartLines = async (id: string, lines: CartLineUpdateInput[]) => {
    const variables = {
        cartId: id,
        lines,
    }

    try {
        const { data, errors } = await storefrontAPIClient(UPDATE_CART_LINES, { variables })

        checkGraphQLErrors(errors)
        checkUserErrors(data?.cartLinesUpdate?.userErrors)

        const cart = data?.cartLinesUpdate?.cart
        const safeCart = toSafeCart(cart)

        return safeCart
    } catch (error) {
        throw error
    }
}

export const removeCartLines = async (id: string, lineIds: string[]) => {
    const variables = {
        cartId: id,
        lineIds,
    }

    try {
        const { data, errors } = await storefrontAPIClient(REMOVE_CART_LINES, { variables })

        checkGraphQLErrors(errors)
        checkUserErrors(data?.cartLinesRemove?.userErrors)

        const cart = data?.cartLinesRemove?.cart
        const safeCart = toSafeCart(cart)

        return safeCart
    } catch (error) {
        throw error
    }
}
