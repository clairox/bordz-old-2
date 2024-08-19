import { checkGraphQLErrors, storefrontAPIFetcher } from '@/lib/fetcher/fetcher'
import { GET_CART } from '@/lib/storefrontAPI/queries'
import { toSafeCart } from './validators'

export const getCart = async (id: string) => {
    try {
        const { data, errors } = await storefrontAPIFetcher(GET_CART, {
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
