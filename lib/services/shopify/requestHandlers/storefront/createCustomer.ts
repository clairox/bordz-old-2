import { CREATE_CUSTOMER } from '@/lib/graphql/shopify/storefront/mutations'
import { storefrontClient } from './base'
import { createCustomerAccessToken } from './createCustomerAccessToken'
import { getCustomer } from './getCustomer'
import { createCustomerMetafields } from '../admin'

export const createCustomer = async (
    email: string,
    password: string,
    firstName: string,
    lastName: string,
    birthDate: Date,
    cartId: string,
    wishlist: string[],
    phone?: string,
) => {
    const config = {
        variables: {
            email,
            password,
            firstName,
            lastName,
            phone,
        },
    }

    try {
        const { customerCreate } = await storefrontClient(
            CREATE_CUSTOMER,
            'customerCreate',
            config,
            { TAKEN: 409 },
        )

        const id = customerCreate?.customer?.id
        if (typeof id !== 'string') {
            throw new Error('An error occurred during signup')
        }

        await createCustomerMetafields(id, birthDate, cartId, wishlist)
        const customerAccessToken = await createCustomerAccessToken(email, password)
        const customer = await getCustomer(customerAccessToken.accessToken)

        return { customer, customerAccessToken }
    } catch (error) {
        throw error
    }
}
