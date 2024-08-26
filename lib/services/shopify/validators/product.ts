import { CollectionLink, Product, Variant } from '@/types/store'
import {
    ensureArray,
    ensureBoolean,
    ensureImage,
    ensureMoney,
    ensureNullableMoney,
    ensureNumber,
    ensureString,
} from './typeGuards'

const ensureVariant = (variant: any): Variant => ({
    availableForSale: ensureBoolean(variant.availableForSale),
    compareAtPrice: ensureNullableMoney(variant.compareAtPriceV2),
    id: ensureString(variant.id),
    price: ensureMoney(variant.priceV2),
    quantityAvailable: ensureNumber(variant.quantityAvailable),
    title: ensureString(variant.title),
})

const ensureCollectionLink = (relatedCollection: any): CollectionLink => ({
    handle: ensureString(relatedCollection.handle),
    title: ensureString(relatedCollection.title),
})

export const validateProduct = (product: any): Product => {
    const error = new Error('Safe product conversion failed')
    if (!product) {
        console.error(error)
        throw error
    }

    const collectionMetafield = product?.metafields?.find(
        (metafield: any) => metafield.key === 'collection',
    )

    const departmentMetafield = product?.metafields?.find(
        (metafield: any) => metafield.key === 'department',
    )

    console.log(collectionMetafield)

    try {
        const safeProduct: Product = {
            availableForSale: ensureBoolean(product.availableForSale),
            collection: ensureCollectionLink(collectionMetafield?.reference),
            department: ensureString(departmentMetafield?.value),
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
