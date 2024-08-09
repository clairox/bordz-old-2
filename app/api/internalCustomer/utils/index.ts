import { DeleteCustomerMutation } from '@/__generated__/admin/graphql'
import { CustomerErrorCode, UpdateCustomerMutation } from '@/__generated__/storefront/graphql'
import { DELETE_CUSTOMER } from '@/lib/adminAPI/mutations'
import { gqlFetcher } from '@/lib/fetcher'
import { UPDATE_CUSTOMER } from '@/lib/storefrontAPI/mutations'
import { GET_CUSTOMER_ID_ONLY } from '@/lib/storefrontAPI/queries'
import { GenericAPIError, makeGQLError, UserError } from '@/lib/utils/api'
import { print } from 'graphql'

type UpdateCustomerResult = UpdateCustomerMutation['customerUpdate']
type DeleteCustomerResult = DeleteCustomerMutation['customerDelete']
type CustomerUserError = UserError & { code?: CustomerErrorCode | null }

const makeCustomerUserError = (errors: CustomerUserError[]) => {
	const { code } = errors[0]

	let message = ''
	switch (code) {
		case 'UNIDENTIFIED_CUSTOMER':
			message = 'Login failed. Please verify your email and password.'
			return new GenericAPIError(message, code, 401)
		default:
			return new GenericAPIError()
	}
}

const makeDeleteCustomerUserError = (errors: UserError[]) => {
	const message = errors[0].message
	const code = 'DELETE_ERROR'
	return new GenericAPIError(message, code, 500)
}

export const updateCustomer = async (
	customerAccessToken: string,
	email: string,
	password: string,
	firstName: string,
	lastName: string
) => {
	const storefrontAccessToken = process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN
	if (storefrontAccessToken === undefined) {
		throw new Error('Missing Shopify Storefront access token')
	}

	const { data, errors } = await gqlFetcher({
		api: 'storefront',
		query: print(UPDATE_CUSTOMER),
		variables: { customerAccessToken, email, password, firstName, lastName },
		token: storefrontAccessToken,
	})

	if (errors) {
		throw makeGQLError(errors)
	}

	const updateCustomerResult: UpdateCustomerResult = data?.customerUpdate

	const userErrors = updateCustomerResult?.customerUserErrors
	if (userErrors && userErrors.length > 0) {
		throw makeCustomerUserError(userErrors)
	}

	const customer = updateCustomerResult?.customer
	if (customer == undefined) {
		throw new GenericAPIError()
	}

	// NOTE customerAccessToken will not be defined unless password is updated
	const newAccessToken = updateCustomerResult?.customerAccessToken

	return { customer, newAccessToken }
}

export const getCustomer = async (customerAccessToken: string) => {
	const storefrontAccessToken = process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN
	if (storefrontAccessToken === undefined) {
		throw new Error('Missing Shopify Storefront access token')
	}

	const { data, errors } = await gqlFetcher({
		api: 'storefront',
		query: print(GET_CUSTOMER_ID_ONLY),
		variables: { customerAccessToken },
		token: storefrontAccessToken,
	})

	if (errors) {
		throw makeGQLError(errors)
	}

	const customer = data?.customer
	if (customer == undefined) {
		throw new GenericAPIError()
	}

	return { customer }
}

export const deleteCustomer = async (customerId: string) => {
	const adminAccessToken = process.env.SHOPIFY_ADMIN_API_ACCESS_TOKEN
	if (adminAccessToken === undefined) {
		throw new Error('Missing Shopify access token')
	}

	const { data, errors } = await gqlFetcher({
		api: 'admin',
		query: print(DELETE_CUSTOMER),
		variables: { id: customerId },
		token: adminAccessToken,
	})

	if (errors) {
		throw makeGQLError(errors)
	}

	const deleteCustomerResult: DeleteCustomerResult = data?.customerDelete

	const userErrors = deleteCustomerResult?.userErrors
	if (userErrors && userErrors.length > 0) {
		throw makeDeleteCustomerUserError(userErrors)
	}

	const deletedCustomerId = deleteCustomerResult?.deletedCustomerId
	if (deletedCustomerId == undefined) {
		throw new GenericAPIError()
	}

	return { deletedCustomerId }
}
