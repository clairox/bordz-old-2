import { ProductCollectionSortKeys, ProductFilter } from '@/__generated__/graphql'
import { ReadonlyURLSearchParams } from 'next/navigation'

export const MAX_PRODUCTS_PER_LOAD = 40

export const getSortKey = (sortByParam: string | null) => {
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

const getFiltersFromSearchParam = (
	searchParam: string | null,
	filterType: 'brand' | 'size' | 'color'
): ProductFilter[] => {
	if (searchParam === null || searchParam === undefined) {
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

export const getFilters = (
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

	return [
		...defaultFilters,
		...getFiltersFromSearchParam(searchParams.get('brand'), 'brand'),
		...getFiltersFromSearchParam(searchParams.get('size'), 'size'),
		...getFiltersFromSearchParam(searchParams.get('color'), 'color'),
	]
}

export const getFiltersServer = (
	searchParams: { [key: string]: string },
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

	return [
		...defaultFilters,
		...getFiltersFromSearchParam(searchParams['brand'], 'brand'),
		...getFiltersFromSearchParam(searchParams['size'], 'size'),
		...getFiltersFromSearchParam(searchParams['color'], 'color'),
	]
}
