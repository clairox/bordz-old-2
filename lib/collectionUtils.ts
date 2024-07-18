import { ProductCollectionSortKeys, ProductFilter } from '@/__generated__/graphql'
import { ReadonlyURLSearchParams } from 'next/navigation'

const getSortKey = (sortByParam: string | null) => {
	switch (sortByParam) {
		case 'recommended':
			return { sortKey: ProductCollectionSortKeys.BestSelling, reverse: true }
		case 'newest':
			return { sortKey: ProductCollectionSortKeys.Created, reverse: false }
		case 'priceLowToHigh':
			return { sortKey: ProductCollectionSortKeys.Price, reverse: false }
		case 'priceHighToLow':
			return { sortKey: ProductCollectionSortKeys.Price, reverse: true }
		default:
			return { sortKey: ProductCollectionSortKeys.BestSelling, reverse: true }
	}
}

const getFilters = (
	searchParams: ReadonlyURLSearchParams,
	subcollectionParam: string | null
): ProductFilter[] => {
	let defaultFilters: ProductFilter[] = [{ available: true }]
	if (subcollectionParam) {
		defaultFilters = defaultFilters.concat([
			{
				productMetafield: {
					namespace: 'custom',
					key: 'subcategory',
					value: subcollectionParam,
				},
			},
		])
	}

	const getFiltersFromSearchParam = (
		searchParam: string | null,
		filterType: 'brand' | 'size' | 'color'
	): ProductFilter[] => {
		if (searchParam === null) {
			return []
		}

		const searchParamValues = searchParam.split('|')
		switch (filterType) {
			case 'brand':
				return searchParamValues.map(brand => ({ productVendor: brand }))
			case 'size':
				return searchParamValues.map(size => ({ variantOption: { name: 'size', value: size } }))
			case 'color':
				return searchParamValues.map(color => ({
					productMetafield: { namespace: 'custom', key: 'color', value: color },
				}))
		}
	}

	return [
		...defaultFilters,
		...getFiltersFromSearchParam(searchParams.get('brand'), 'brand'),
		...getFiltersFromSearchParam(searchParams.get('size'), 'size'),
		...getFiltersFromSearchParam(searchParams.get('color'), 'color'),
	]
}

export { getSortKey, getFilters }
