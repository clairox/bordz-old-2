import { storefrontClient } from './base'
import { validateCustomer } from '@/lib/services/shopify/validators'
import { GET_CUSTOMER } from '@/lib/graphql/shopify/storefront/queries'

export const getCustomer = async (customerAccessToken: string) => {
    const config = {
        variables: { customerAccessToken },
    }
    try {
        const { customer } = await storefrontClient(GET_CUSTOMER, 'customer', config)

        return validateCustomer(customer)
    } catch (error) {
        throw error
    }
}
