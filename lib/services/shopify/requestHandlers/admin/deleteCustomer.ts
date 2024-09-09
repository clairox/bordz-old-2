import { DELETE_CUSTOMER } from '@/lib/graphql/shopify/admin/mutations'
import { adminClient } from './base'

export const deleteCustomer = async (customerId: string) => {
    const config = {
        variables: {
            id: customerId,
        },
    }

    try {
        const { customerDelete } = await adminClient(DELETE_CUSTOMER, 'customerDelete', config)
        const deletedCustomerId = customerDelete?.deletedCustomerId
        if (deletedCustomerId !== customerId) {
            throw new Error('Incorrect customer deleted. Fix immediately')
        }

        return deletedCustomerId
    } catch (error) {}
}
