import {
    ensureBoolean,
    ensureImage,
    ensureMoney,
    ensureNullableMoney,
    ensureNumber,
    ensureString,
} from './typeGuards'
import { ProductListItem } from '@/types/store'

export const validateCollectionItem = (product: any): ProductListItem => {
    const error = new Error('Safe collection item conversion failed')
    if (!product) {
        console.error(error)
        throw error
    }

    try {
        const safeProductListItem = {
            availableForSale: ensureBoolean(product.availableForSale),
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
