import {
	CreateCartMutation,
	CartErrorCode,
	CustomerErrorCode,
	SignupMutation,
} from '@/__generated__/storefront/graphql'
import { gqlFetcher } from '@/lib/fetcher'
import { CREATE_CART, SIGNUP } from '@/lib/storefrontAPI/mutations'
import { APIError, makeGQLError, UserError } from '@/lib/utils/api'
import { print } from 'graphql'

type SignupResult = SignupMutation['customerCreate']
type CreateCartResult = CreateCartMutation['cartCreate']
type CustomerUserError = UserError & { code?: CustomerErrorCode | null }
type CartUserError = UserError & { code?: CartErrorCode | null }

const makeCustomerUserError = (errors: CustomerUserError[]) => {
	const { code } = errors[0]

	let message = ''
	switch (code) {
		case 'TAKEN':
			message = 'An account with this email already exists.'
			return new APIError(message, code, 409)
		default:
			return new APIError()
	}
}

const makeCartUserError = (errors: CartUserError[]) => {
	const { code } = errors[0]

	switch (code) {
		default:
			return new APIError()
	}
}

export const signup = async (
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
		query: print(SIGNUP),
		variables: { email, password, firstName, lastName },
		token: storefrontAccessToken,
	})

	if (errors) {
		throw makeGQLError(errors)
	}

	const signupResult: SignupResult = data?.customerCreate

	const customerUserErrors = signupResult?.customerUserErrors
	if (customerUserErrors && customerUserErrors.length > 0) {
		throw makeCustomerUserError(customerUserErrors)
	}

	const customer = signupResult?.customer
	if (customer == undefined) {
		throw new APIError()
	}

	return customer
}

export const createCart = async () => {
	const storefrontAccessToken = process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN
	if (storefrontAccessToken === undefined) {
		throw new Error('Missing Shopify Storefront access token')
	}

	const { data, errors } = await gqlFetcher({
		api: 'storefront',
		query: print(CREATE_CART),
		token: storefrontAccessToken,
	})

	if (errors) {
		makeGQLError(errors)
	}

	const createCartResult: CreateCartResult = data?.cartCreate

	const userErrors = createCartResult?.userErrors
	if (userErrors && userErrors.length > 0) {
		makeCartUserError(userErrors)
	}

	const cart = createCartResult?.cart
	if (cart == undefined) {
		throw new APIError()
	}

	return cart
}
