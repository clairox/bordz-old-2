import { CustomerErrorCode, LoginMutation } from '@/__generated__/storefront/graphql'
import { gqlFetcher } from '@/lib/fetcher'
import { LOGIN } from '@/lib/storefrontAPI/mutations'
import { APIError, makeGQLError, UserError } from '@/lib/utils/api'
import { print } from 'graphql'

type LoginResult = LoginMutation['customerAccessTokenCreate']
type CustomerUserError = UserError & { code?: CustomerErrorCode | null }

const makeCustomerUserError = (errors: CustomerUserError[]) => {
	const { code } = errors[0]

	let message = ''
	switch (code) {
		case 'UNIDENTIFIED_CUSTOMER':
			message = 'Login failed. Please verify your email and password.'
			return new APIError(message, code, 401)
		default:
			return new APIError()
	}
}

export const login = async (email: string, password: string) => {
	const storefrontAccessToken = process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN
	if (storefrontAccessToken === undefined) {
		throw new Error('Missing Shopify Storefront access token')
	}

	const { data, errors } = await gqlFetcher({
		api: 'storefront',
		query: print(LOGIN),
		variables: { email, password },
		token: storefrontAccessToken,
	})

	if (errors) {
		throw makeGQLError(errors)
	}

	const loginResult: LoginResult = data?.customerAccessTokenCreate

	const customerUserErrors = loginResult?.customerUserErrors
	if (customerUserErrors && customerUserErrors.length > 0) {
		throw makeCustomerUserError(customerUserErrors)
	}

	const customerAccessToken = loginResult?.customerAccessToken
	if (customerAccessToken == undefined) {
		throw new APIError()
	}

	return customerAccessToken
}
