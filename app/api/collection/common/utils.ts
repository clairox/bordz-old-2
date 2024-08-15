import { ProductCollectionSortKeys } from '@/__generated__/storefront/graphql'
import { isNumeric } from '@/lib/utils/number'
import { FilterArray, FilterValues, SortByKey } from '../types'

export const isSortByKey = (value: string | undefined): value is SortByKey => {
	const sortBy: SortByKey[] = ['recommended', 'newest', 'priceLowToHigh', 'priceHighToLow']
	return sortBy.includes(value as SortByKey)
}

export const processPriceParam = (price: string | undefined): number[] => {
	const priceRange = price?.split(',')
	if (priceRange == undefined || priceRange.length !== 2) {
		return []
	}

	const [priceMin, priceMax] = priceRange

	if (!isNumeric(priceMin) || !isNumeric(priceMax)) {
		return []
	}

	const min = parseInt(priceMin)
	const max = parseInt(priceMax)

	if (max <= min) {
		return []
	}

	return [min, max]
}

const isValidPriceRange = (priceRange: number[]): boolean =>
	priceRange[0] < priceRange[1] && priceRange.length === 2

const constructBrandFilters = (brands: string[]): FilterArray => {
	return brands.map(brand => ({ productVendor: brand }))
}

const constructSizeFilters = (sizes: string[]): FilterArray => {
	return sizes.map(size => ({ variantOption: { name: 'size', value: size } }))
}

const constructColorFilters = (colors: string[]): FilterArray => {
	return colors.map(color => ({
		productMetafield: { key: 'color', namespace: 'custom', value: color },
	}))
}

export const makeProductFilters = (filterValues: FilterValues): FilterArray => {
	const baseFilterArray: FilterArray = [{ available: true }]

	if (filterValues.subcategory) {
		baseFilterArray.push({
			productMetafield: {
				namespace: 'custom',
				key: 'subcategory',
				value: filterValues.subcategory,
			},
		})
	}

	if (filterValues.price && isValidPriceRange(filterValues.price)) {
		const [min, max] = filterValues.price
		baseFilterArray.push({ price: { min, max } })
	}

	return [
		...baseFilterArray,
		...constructBrandFilters(filterValues.brands),
		...constructSizeFilters(filterValues.sizes),
		...constructColorFilters(filterValues.colors),
	]
}

export const makeSortInputs = (sortBy: string | undefined) => {
	const { BestSelling, Created, Price } = ProductCollectionSortKeys
	switch (sortBy) {
		case 'recommended':
			return { sortKey: BestSelling, reverse: true }
		case 'newest':
			return { sortKey: Created, reverse: false }
		case 'priceLowToHigh':
			return { sortKey: Price, reverse: false }
		case 'priceHighToLow':
			return { sortKey: Price, reverse: true }
		default:
			return { sortKey: BestSelling, reverse: true }
	}
}
