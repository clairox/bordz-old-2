import { CREATE_ACCESS_TOKEN } from '@/lib/graphql/shopify/storefront/mutations'
import { storefrontClient } from './base'

export const createCustomerAccessToken = async (email: string, password: string) => {
    const config = { variables: { email, password } }

    try {
        const { customerAccessTokenCreate } = await storefrontClient(
            CREATE_ACCESS_TOKEN,
            'customerAccessTokenCreate',
            config,
            { 'Unidentified customer': 401 },
        )
        const customerAccessToken = customerAccessTokenCreate?.customerAccessToken
        if (customerAccessToken == undefined) {
            throw new Error('An error occurred while creating access token')
        }

        return customerAccessToken
    } catch (error) {
        throw error
    }
}
