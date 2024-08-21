import { checkGraphQLErrors, storefrontAPIClient } from '@/lib/services/clients/graphqlClient'
import { GET_PRODUCT } from '@/lib/graphql/shopify/storefront/queries'
import { toSafeProduct } from './validators'

export const getProduct = async (handle: string) => {
    const variables = { handle }
    try {
        const { data, errors } = await storefrontAPIClient(GET_PRODUCT, { variables })

        checkGraphQLErrors(errors)

        const safeProduct = toSafeProduct(data?.productByHandle)

        return safeProduct
    } catch (error) {
        throw error
    }
}
