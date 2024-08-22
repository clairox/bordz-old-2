import {
    ensureArray,
    ensureBoolean,
    ensureImage,
    ensureNumber,
    ensureSelectedOption,
    ensureString,
} from './typeGuards'
import { WishlistItem, WishlistItemProduct } from '@/types/store'

const ensureProduct = (product: any): WishlistItemProduct => ({
    featuredImage: ensureImage(product.featuredImage),
    handle: ensureString(product.handle),
    id: ensureString(product.id),
    title: ensureString(product.title),
})

export const validateProductVariantItem = (item: any): WishlistItem => {
    const error = new Error('Safe product variant item conversion failed')
    if (item == undefined) {
        console.error(error)
        throw error
    }

    try {
        const safeWishlistItem = {
            availableForSale: ensureBoolean(item.availableForSale),
            compareAtPrice: ensureNumber(+item.compareAtPrice),
            id: ensureString(item.id),
            price: ensureNumber(+item.price),
            title: ensureString(item.title),
            product: ensureProduct(item.product),
            selectedOptions: ensureArray(item.selectedOptions, ensureSelectedOption),
        }

        return safeWishlistItem
    } catch (error) {
        console.error(error)
        throw error
    }
}
