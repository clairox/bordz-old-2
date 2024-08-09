import type { Customer as InternalCustomer } from '@prisma/client'
import { fetcher } from '../fetcher'

type UpdateInternalCustomerFields = {
	cartId?: string
	birthDate?: Date
	wishlist?: string[]
}

const getInternalCustomer = async (): Promise<InternalCustomer | null> => {
	try {
		const response = await fetcher('/internalCustomer')
		return response.data as InternalCustomer
	} catch (error) {
		console.error(error)
		return null
	}
}

const updateInternalCustomer = async (
	fields: UpdateInternalCustomerFields
): Promise<InternalCustomer | null> => {
	try {
		const response = await fetcher('/internalCustomer', {
			method: 'PATCH',
			body: JSON.stringify(fields),
		})
		return response.data
	} catch (error) {
		console.error(error)
		return null
	}
}

export { getInternalCustomer, updateInternalCustomer }
