import { checkGraphQLErrors, checkUserErrors, storefrontAPIFetcher } from '@/lib/fetcher/fetcher'
import { CREATE_ACCESS_TOKEN } from '@/lib/storefrontAPI/mutations'

export const createAccessToken = async (email: string, password: string) => {
	const variables = { email, password }

	try {
		const { data, errors } = await storefrontAPIFetcher(CREATE_ACCESS_TOKEN, { variables })

		checkGraphQLErrors(errors)
		checkUserErrors(data?.customerAccessTokenCreate?.customerUserErrors, {
			UNIDENTIFIED_CUSTOMER: 401,
		})

		const customerAccessToken = data?.customerAccessTokenCreate?.customerAccessToken
		if (customerAccessToken == undefined) {
			throw new Error('An error occurred while creating access token')
		}

		return customerAccessToken
	} catch (error) {
		throw error
	}
}
