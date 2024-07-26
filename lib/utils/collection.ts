import { ProductCollectionSortKeys, ProductFilter } from '@/__generated__/graphql'
import { ReadonlyURLSearchParams } from 'next/navigation'
import { isNumeric } from './number'
import { ProductFilterMap } from '@/types'

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

export const getFiltersFromSearchParam = (
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

export const getFiltersFromSearchParams = (params: URLSearchParams): ProductFilterMap => {
	const entries = Array.from(params.entries())
	const productFilterEntries = entries.filter(entry => {
		const key = entry[0]
		return key !== 'start' && key !== 'sortBy' && key !== 'priceMin' && key !== 'priceMax'
	})
	return new Map(
		productFilterEntries.map(entry => {
			const [key, value] = entry
			return [key, value.split('|')]
		})
	)
}

export const processPriceParams = (priceMin: string | null, priceMax: string | null): number[] => {
	if (priceMin === null || priceMax === null || !isNumeric(priceMin) || !isNumeric(priceMax)) {
		return []
	}

	const min = parseInt(priceMin)
	const max = parseInt(priceMax)

	if (max <= min) {
		return []
	}

	return [min, max]
}

export const mergeProductFilterMaps = (
	firstFilterMap: ProductFilterMap,
	secondFilterMap: ProductFilterMap
): ProductFilterMap => {
	const newFilterMap: ProductFilterMap = new Map<string, string[]>()

	const keys1 = Array.from(firstFilterMap.keys())
	const keys2 = Array.from(secondFilterMap.keys())

	const checkedKeys = new Set()

	keys1.forEach(key => {
		if (secondFilterMap.get(key) !== undefined) {
			const uniqueValues = new Set([...firstFilterMap.get(key)!, ...secondFilterMap.get(key)!])
			const values = Array.from(uniqueValues).toSorted()
			newFilterMap.set(key, values)
		} else {
			newFilterMap.set(key, firstFilterMap.get(key)!)
		}

		checkedKeys.add(key)
	})

	keys2.forEach(key => {
		if (checkedKeys.has(key)) {
			return
		}

		if (firstFilterMap.get(key) !== undefined) {
			const uniqueValues = new Set([...secondFilterMap.get(key)!, ...firstFilterMap.get(key)!])
			const values = Array.from(uniqueValues).toSorted()
			newFilterMap.set(key, values)
		} else {
			newFilterMap.set(key, secondFilterMap.get(key)!)
		}
	})

	return newFilterMap
}

export const isValidPriceRange = (priceRange: number[]): boolean =>
	priceRange[0] < priceRange[1] && priceRange.length === 2
