import { checkGraphQLErrors, storefrontAPIFetcher } from '@/lib/fetcher/fetcher'
import { isSortByKey, makeProductFilters, makeSortInputs } from './utils'
import { GET_COLLECTION, GET_COLLECTION_MAX_PRICE } from '@/lib/storefrontAPI/queries'
import { toSafeAvailableFilter, toSafeProductListItem } from './validators'

export const getCollection = async (
	handle: string,
	priceRange: number[],
	sortBy: string,
	subcategory?: string,
	limit: number = 40,
	brands: string[] = [],
	sizes: string[] = [],
	colors: string[] = []
) => {
	if (!isSortByKey(sortBy)) {
		sortBy = 'recommended'
	}

	const filters = makeProductFilters({
		subcategory,
		brands,
		sizes,
		colors,
		price: priceRange,
	})
	const { sortKey, reverse } = makeSortInputs(sortBy)
	const variables = {
		handle,
		limit,
		sortKey,
		reverse,
		filters,
	}

	try {
		const { data, errors } = await storefrontAPIFetcher(GET_COLLECTION, { variables })

		checkGraphQLErrors(errors)

		const collection = data?.collection

		const products = collection?.products.nodes
		const hasNextPage = collection?.products.pageInfo.hasNextPage
		const availableFilters = collection?.products.filters

		if (typeof hasNextPage !== 'boolean') {
			throw new Error('hasNextPage is not of boolean type')
		}

		const safeProducts = products?.map(product => toSafeProductListItem(product))
		const safeAvailableFilters = availableFilters?.map(filter => toSafeAvailableFilter(filter))

		return { products: safeProducts, availableFilters: safeAvailableFilters, hasNextPage }
	} catch (error) {
		throw error
	}
}

export const getCollectionMaxPrice = async (
	handle: string,
	priceRange: number[],
	subcategory?: string,
	limit: number = 40,
	brands: string[] = [],
	sizes: string[] = [],
	colors: string[] = []
) => {
	const filters = makeProductFilters({
		subcategory,
		brands,
		sizes,
		colors,
		price: priceRange,
	})
	const variables = {
		handle,
		limit,
		filters,
	}

	try {
		const { data, errors } = await storefrontAPIFetcher(GET_COLLECTION_MAX_PRICE, { variables })

		checkGraphQLErrors(errors)

		const maxPrice = data?.collection?.products.nodes.reduce((previousPrice, currentProduct) => {
			const currentPrice = Number(currentProduct.priceRange.maxVariantPrice.amount)
			if (currentPrice > previousPrice) {
				return currentPrice
			}

			return previousPrice
		}, 0)

		if (typeof maxPrice !== 'number') {
			throw new Error('maxPrice is not of number type')
		}

		return maxPrice
	} catch (error) {
		throw error
	}
}
