import { GET_CUSTOMER_ID_ONLY } from '@/lib/graphql/shopify/storefront/queries'
import { storefrontClient } from './base'

export const getCustomerId = async (customerAccessToken: string) => {
    const config = {
        variables: { customerAccessToken },
        cache: 'no-cache' as RequestCache,
    }

    try {
        const { customer } = await storefrontClient(GET_CUSTOMER_ID_ONLY, 'customer', config)

        const id = customer?.id
        if (typeof id !== 'string') {
            throw new Error('id is not of type string')
        }

        return id
    } catch (error) {
        throw error
    }
}
