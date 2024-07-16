import {
	GetCollectionQuery,
	ProductCollectionSortKeys,
	ProductFilter,
} from '@/__generated__/graphql'
import { GET_COLLECTION } from '@/lib/queries'
import { ProductListItem } from '@/types'
import { useSuspenseQuery } from '@apollo/client'

const useCollection = (
	handle: string,
	limit: number,
	sortKey: ProductCollectionSortKeys,
	filters: ProductFilter[]
) => {
	const { data, error } = useSuspenseQuery(GET_COLLECTION, {
		variables: { handle, limit, sortKey, filters },
		fetchPolicy: 'cache-and-network',
	})

	const collection = (data as GetCollectionQuery).collection
	const fetchedProducts = collection?.products
	const fetchedFilters = fetchedProducts?.filters

	const renderableProducts = fetchedProducts?.nodes.map(
		product =>
			({
				title: product.title,
				handle: product.handle,
				price: product.priceRange.maxVariantPrice.amount,
				featuredImage: {
					src: product.featuredImage?.src,
					width: product.featuredImage?.width,
					height: product.featuredImage?.height,
				},
			} as ProductListItem)
	)

	const productCount = fetchedFilters
		?.find(filter => filter.label === 'Availability')
		?.values.find(value => value.label === 'In stock')?.count

	const availableFilters = fetchedFilters
		?.filter(filter => {
			const productFilterLabels = ['Brand', 'Size', 'Color']
			return productFilterLabels.includes(filter.label)
		})
		.map(filter => ({
			label: filter.label.toLowerCase(),
			values: filter.values.filter(value => value.count > 0).map(value => value.label),
		}))

	const priceFilter = JSON.parse(
		fetchedFilters
			?.find(filter => filter.label === 'Price')
			?.values.find(value => value.label === 'Price')?.input
	).price
	const filteredPriceRange = [priceFilter.min, priceFilter.max]

	const subcollectionTitles = fetchedFilters
		?.find(filter => filter.label === 'Subcollection')
		?.values.map(value => value.label)
		.toSorted()

	const hasNextPage = fetchedProducts?.pageInfo.hasNextPage

	return {
		collection,
		renderableProducts,
		productCount,
		availableFilters,
		filteredPriceRange,
		subcollectionTitles,
		hasNextPage,
		error,
	}
}

export { useCollection }
