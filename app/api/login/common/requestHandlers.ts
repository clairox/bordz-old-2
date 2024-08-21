import {
    checkGraphQLErrors,
    checkUserErrors,
    storefrontAPIClient,
} from '@/lib/services/clients/graphqlClient'
import { CREATE_ACCESS_TOKEN } from '@/lib/graphql/shopify/storefront/mutations'

export const createAccessToken = async (email: string, password: string) => {
    const variables = { email, password }

    try {
        const { data, errors } = await storefrontAPIClient(CREATE_ACCESS_TOKEN, { variables })

        checkGraphQLErrors(errors)
        checkUserErrors(data?.customerAccessTokenCreate?.customerUserErrors, {
            UNIDENTIFIED_CUSTOMER: 401,
        })

        const customerAccessToken = data?.customerAccessTokenCreate?.customerAccessToken
        if (customerAccessToken == undefined) {
            throw new Error('An error occurred while creating access token')
        }

        return customerAccessToken
    } catch (error) {
        throw error
    }
}
