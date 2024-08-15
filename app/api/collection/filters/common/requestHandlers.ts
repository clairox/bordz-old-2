import { checkGraphQLErrors, storefrontAPIFetcher } from '@/lib/fetcher/fetcher'
import { makeProductFilters } from '../../common/utils'
import { GET_PRODUCT_FILTERS, GET_COLLECTION_MAX_PRICE } from '@/lib/storefrontAPI/queries'

export const getProductFilters = async (
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
		const { data, errors } = await storefrontAPIFetcher(GET_PRODUCT_FILTERS, { variables })

		checkGraphQLErrors(errors)

		const fetchedFilters = data?.collection?.products?.filters
		if (fetchedFilters == undefined) {
			throw new Error('An error occurred while fetching filters')
		}

		const productFilters: Record<string, string[]> = {}

		fetchedFilters
			.filter(filter => {
				const labels = ['Brand', 'Size', 'Color']
				return labels.includes(filter.label)
			})
			.forEach(filter => {
				const key = filter.label.toLowerCase()
				const values = filter.values.filter(value => value.count > 0).map(value => value.label)
				productFilters[key] = values
			})

		const priceFilter = JSON.parse(
			fetchedFilters
				.find(filter => filter.label === 'Price')
				?.values.find(value => value.label === 'Price')?.input
		).price

		productFilters.price = [priceFilter.min, priceFilter.max]

		return productFilters
	} catch (error) {
		throw error
	}
}
