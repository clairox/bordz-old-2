import {
	adminAPIFetcher,
	checkGraphQLErrors,
	checkUserErrors,
	storefrontAPIFetcher,
} from '@/lib/fetcher/fetcher'
import { GET_CUSTOMER } from '@/lib/storefrontAPI/queries'
import { toSafeCustomer } from './validators'
import { UpdateCustomerValues } from '@/types/store'
import { UPDATE_CUSTOMER } from '@/lib/storefrontAPI/mutations'
import { DELETE_CUSTOMER } from '@/lib/adminAPI/mutations'

export const getCustomer = async (customerAccessToken: string) => {
	const variables = {
		customerAccessToken,
	}

	try {
		const { data, errors } = await storefrontAPIFetcher(GET_CUSTOMER, { variables })

		checkGraphQLErrors(errors)

		const customer = data?.customer
		const safeCustomer = toSafeCustomer(customer)

		return safeCustomer
	} catch (error) {
		throw error
	}
}

export const updateCustomer = async (customerAccessToken: string, values: UpdateCustomerValues) => {
	const { cartId, birthDate, wishlist, ...rest } = values

	const variables = {
		customerAccessToken,
		...rest,
	}

	try {
		// TODO: update cartId, birthDate, wishlist metafield values in the Admin API

		const { data, errors } = await storefrontAPIFetcher(UPDATE_CUSTOMER, { variables })

		checkGraphQLErrors(errors)
		checkUserErrors(data?.customerUpdate?.customerUserErrors, {
			UNIDENTIFIED_CUSTOMER: 401,
		})

		const updatedCustomer = toSafeCustomer(data?.customerUpdate?.customer)
		const newAccessToken = data?.customerUpdate?.customerAccessToken

		return { customer: updatedCustomer, newAccessToken }
	} catch (error) {
		throw error
	}
}

export const deleteCustomer = async (customerId: string) => {
	const variables = {
		id: customerId,
	}

	try {
		const { data, errors } = await adminAPIFetcher(DELETE_CUSTOMER, { variables })

		checkGraphQLErrors(errors)
		checkUserErrors(data?.customerDelete?.userErrors)

		const deletedCustomerId = data?.customerDelete?.deletedCustomerId
		if (deletedCustomerId !== customerId) {
			throw new Error('Incorrect customer deleted. Fix immediately')
		}
		return deletedCustomerId
	} catch (error) {}
}
