import {
    ensureArray,
    ensureBoolean,
    ensureImage,
    ensureNumber,
    ensureSelectedOption,
    ensureString,
} from './typeGuards'
import { VariantItem, VariantItemProduct } from '@/types/store'

const ensureProduct = (product: any): VariantItemProduct => ({
    featuredImage: ensureImage(product.featuredImage),
    handle: ensureString(product.handle),
    id: ensureString(product.id),
    title: ensureString(product.title),
})

export const validateProductVariantItem = (item: any): VariantItem => {
    const error = new Error('Safe product variant item conversion failed')
    if (item == undefined) {
        console.error(error)
        throw error
    }

    try {
        const safeVariantItem = {
            availableForSale: ensureBoolean(item.availableForSale),
            compareAtPrice: ensureNumber(+item.compareAtPrice),
            id: ensureString(item.id),
            price: ensureNumber(+item.price),
            title: ensureString(item.title),
            product: ensureProduct(item.product),
            selectedOptions: ensureArray(item.selectedOptions, ensureSelectedOption),
        }

        return safeVariantItem
    } catch (error) {
        console.error(error)
        throw error
    }
}
