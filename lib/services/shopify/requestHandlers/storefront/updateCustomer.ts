import { UpdateCustomerValues } from '@/types/store'
import { UPDATE_CUSTOMER } from '@/lib/graphql/shopify/storefront/mutations'
import { storefrontClient } from './base'
import { validateCustomer } from '@/lib/services/shopify/validators'

export const updateCustomer = async (customerAccessToken: string, values: UpdateCustomerValues) => {
    const { cartId, birthDate, wishlist, ...rest } = values

    const config = {
        variables: {
            customerAccessToken,
            ...rest,
        },
    }

    try {
        // TODO: update cartId, birthDate, wishlist metafield values in the Admin API

        const { customerUpdate } = await storefrontClient(
            UPDATE_CUSTOMER,
            'customerUpdate',
            config,
            { UNIDENTIFIED_CUSTOMER: 401 },
        )
        const updatedCustomer = validateCustomer(customerUpdate?.customer)
        const newAccessToken = customerUpdate?.customerAccessToken

        return { customer: updatedCustomer, newAccessToken }
    } catch (error) {
        throw error
    }
}
