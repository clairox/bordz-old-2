import { Product } from '@/__generated__/admin/graphql'
import { GetProductVariants_Product, GetProductVariants_ProductVariant } from '../types'
import {
	ensureBoolean,
	ensureImage,
	ensureNumber,
	ensureSelectedOption,
} from '@/lib/utils/typeGuarding'
import { ensureArray, ensureMoney, ensureString } from '@/lib/utils/gql'

const ensureProduct = (product: Product): GetProductVariants_Product => ({
	handle: ensureString(product.handle),
	id: ensureString(product.id),
	title: ensureString(product.title),
	featuredImage: ensureImage(product.featuredImage),
})

export const toSafeProductVariant = (variant: any): GetProductVariants_ProductVariant => {
	if (variant == undefined) {
		throw new Error('Safe product variant conversion failed')
	}

	try {
		const safeProductVariant = {
			availableForSale: ensureBoolean(variant.availableForSale),
			compareAtPrice: variant.compareAtPrice
				? ensureNumber(parseFloat(variant.compareAtPrice))
				: undefined,
			id: ensureString(variant.id),
			price: ensureNumber(parseFloat(variant.price)),
			title: ensureString(variant.title),
			product: ensureProduct(variant.product),
			selectedOptions: ensureArray(variant.selectedOptions, ensureSelectedOption),
		}

		return safeProductVariant
	} catch {
		throw new Error('Safe product variant conversion failed')
	}
}
