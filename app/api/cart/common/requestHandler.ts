import {
    checkGraphQLErrors,
    checkUserErrors,
    storefrontAPIClient,
} from '@/lib/services/clients/graphqlClient'
import { CREATE_CART } from '@/lib/graphql/shopify/storefront/mutations'
import { toSafeCart } from './validators'

export const createCart = async () => {
    try {
        const { data, errors } = await storefrontAPIClient(CREATE_CART)

        checkGraphQLErrors(errors)
        checkUserErrors(data?.cartCreate?.userErrors)

        const cart = data?.cartCreate?.cart
        const safeCart = toSafeCart(cart)

        return safeCart
    } catch (error) {
        throw error
    }
}
