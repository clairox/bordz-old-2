import { checkGraphQLErrors, checkUserErrors, storefrontAPIFetcher } from '@/lib/fetcher/fetcher'
import { CREATE_CART } from '@/lib/storefrontAPI/mutations'
import { toSafeCart } from './validators'

export const createCart = async () => {
    try {
        const { data, errors } = await storefrontAPIFetcher(CREATE_CART)

        checkGraphQLErrors(errors)
        checkUserErrors(data?.cartCreate?.userErrors)

        const cart = data?.cartCreate?.cart
        const safeCart = toSafeCart(cart)

        return safeCart
    } catch (error) {
        throw error
    }
}
