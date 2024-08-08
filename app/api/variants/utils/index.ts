import { GetProductVariantsQuery, ProductVariant } from '@/__generated__/admin/graphql'
import { GET_VARIANTS } from '@/lib/adminAPI/query'
import { gqlFetcher } from '@/lib/fetcher'
import { APIError, makeGQLError } from '@/lib/utils/api'
import { extractResourceId } from '@/lib/utils/ids'
import { print } from 'graphql'

type GetProductVariantResult = GetProductVariantsQuery['productVariants']

const DEFAULT_LIMIT = 40

const toGetVariantsQueryString = (ids: string[]): string => {
	if (ids.length === 0) {
		throw new APIError("'ids' should contain at least one item")
	}

	let queryString = 'id:'
	ids.forEach((id, idx) => {
		const resourceId = extractResourceId(id)
		if (idx === ids.length - 1) {
			queryString += resourceId
			return
		}

		queryString += resourceId + ' OR '
	})

	return queryString
}

export const getVariants = async (ids: string[], limit: number = DEFAULT_LIMIT) => {
	const adminAccessToken = process.env.SHOPIFY_ADMIN_API_ACCESS_TOKEN
	if (adminAccessToken == undefined) {
		throw new Error('Missing Shopify access token')
	}

	const getVariantsQueryString = toGetVariantsQueryString(ids)

	const { data, errors } = await gqlFetcher({
		api: 'admin',
		query: print(GET_VARIANTS),
		variables: { query: getVariantsQueryString, limit },
		token: adminAccessToken,
	})

	if (errors) {
		throw makeGQLError(errors)
	}

	const getProductVariantsResult: GetProductVariantResult = data?.productVariants

	const variants = getProductVariantsResult.nodes
	const hasNextPage = getProductVariantsResult?.pageInfo.hasNextPage
	if (variants == undefined || hasNextPage == undefined) {
		throw new APIError()
	}

	return { variants, hasNextPage }
}
