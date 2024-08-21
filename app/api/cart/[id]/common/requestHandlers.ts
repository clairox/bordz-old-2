import { checkGraphQLErrors, storefrontAPIClient } from '@/lib/services/clients/graphqlClient'
import { GET_CART } from '@/lib/graphql/shopify/storefront/queries'
import { toSafeCart } from './validators'

export const getCart = async (id: string) => {
    try {
        const { data, errors } = await storefrontAPIClient(GET_CART, {
            variables: { id },
            cache: 'no-cache',
        })

        checkGraphQLErrors(errors)

        const cart = data?.cart
        const safeCart = toSafeCart(cart)

        return safeCart
    } catch (error) {
        throw error
    }
}
