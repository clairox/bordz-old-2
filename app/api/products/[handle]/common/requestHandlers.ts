import { checkGraphQLErrors, storefrontAPIFetcher } from '@/lib/fetcher/fetcher'
import { GET_PRODUCT } from '@/lib/storefrontAPI/queries'
import { toSafeProduct } from './validators'

export const getProduct = async (handle: string) => {
	const variables = { handle }
	try {
		const { data, errors } = await storefrontAPIFetcher(GET_PRODUCT, { variables })

		checkGraphQLErrors(errors)

		const safeProduct = toSafeProduct(data?.productByHandle)

		return safeProduct
	} catch (error) {
		throw error
	}
}
