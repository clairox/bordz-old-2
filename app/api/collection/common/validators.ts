import {
	ensureArray,
	ensureBoolean,
	ensureImage,
	ensureMoney,
	ensureNullableMoney,
	ensureNumber,
	ensureString,
} from '@/lib/utils/typeGuarding'
import { AvailableFilter, ProductListItem } from '../types'

const ensureAvailableFilterValue = (filterValue: any): { label: string; count: number } => ({
	label: ensureString(filterValue.label),
	count: ensureNumber(filterValue.count),
})

export const toSafeProductListItem = (product: any): ProductListItem => {
	const error = new Error('Safe product list item conversion failed')
	if (!product) {
		console.error(error)
		throw error
	}

	try {
		const safeProductListItem = {
			availableForSale: ensureBoolean(product.availableForSale),
			description: ensureString(product.description),
			featuredImage: ensureImage(product.featuredImage),
			handle: ensureString(product.handle),
			id: ensureString(product.id),
			price: ensureMoney(product.priceRange.maxVariantPrice),
			title: ensureString(product.title),
			totalInventory: ensureNumber(product.totalInventory),
			compareAtPrice: ensureNullableMoney(product.compareAtPrice),
		}

		return safeProductListItem
	} catch {
		console.error(error)
		throw error
	}
}

export const toSafeAvailableFilter = (filter: any): AvailableFilter => {
	const error = new Error('Safe available filter conversion failed')
	if (!filter) {
		console.error(error)
		throw error
	}

	try {
		const safeAvailableFilter = {
			label: ensureString(filter.label),
			values: ensureArray(filter.values, ensureAvailableFilterValue),
		}

		return safeAvailableFilter
	} catch {
		console.error(error)
		throw error
	}
}
