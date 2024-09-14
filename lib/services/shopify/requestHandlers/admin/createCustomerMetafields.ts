import { CREATE_CUSTOMER_METAFIELDS } from '@/lib/graphql/shopify/admin/mutations'
import { adminClient } from './base'

export const createCustomerMetafields = async (
    customerId: string,
    birthDate: Date,
    cartId: string,
    savedItemsIds: string[],
) => {
    const config = {
        variables: {
            id: customerId,
            birthDate: birthDate.toISOString(),
            wishlist: JSON.stringify(savedItemsIds),
            cartId,
        },
    }

    try {
        const { customerUpdate } = await adminClient(
            CREATE_CUSTOMER_METAFIELDS,
            'customerUpdate',
            config,
        )

        const id = customerUpdate?.customer?.id
        if (typeof id !== 'string') {
            throw new Error('An error occurred while creating customer metafields')
        }

        return id
    } catch (error) {
        throw error
    }
}
