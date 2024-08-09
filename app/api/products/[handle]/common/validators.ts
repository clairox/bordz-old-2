import {
	ensureArray,
	ensureBoolean,
	ensureImage,
	ensureMoney,
	ensureNullableMoney,
	ensureNumber,
	ensureString,
} from '@/lib/utils/typeGuarding'
import { Product, Variant } from '../types'

const ensureVariant = (variant: any): Variant => ({
	availableForSale: ensureBoolean(variant.availableForSale),
	compareAtPrice: ensureNullableMoney(variant.compareAtPriceV2),
	id: ensureString(variant.id),
	price: ensureMoney(variant.priceV2),
	quantityAvailable: ensureNumber(variant.quantityAvailable),
	title: ensureString(variant.title),
})

export const toSafeProduct = (product: any): Product => {
	const error = new Error('Safe product conversion failed')
	if (!product) {
		console.error(error)
		throw error
	}

	try {
		const safeProduct: Product = {
			description: ensureString(product.description),
			handle: ensureString(product.handle),
			id: ensureString(product.id),
			images: ensureArray(product.images.nodes, ensureImage),
			productType: ensureString(product.productType),
			title: ensureString(product.title),
			variants: ensureArray(product.variants.nodes, ensureVariant),
			vendor: ensureString(product.vendor),
		}

		return safeProduct
	} catch (error) {
		console.error(error)
		throw error
	}
}
