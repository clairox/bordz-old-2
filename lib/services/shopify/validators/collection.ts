import {
    Collection,
    CollectionLink,
    FilterGroup,
    FilterOption,
    ProductListItem,
} from '@/types/store'
import {
    ensureArray,
    ensureBoolean,
    ensureImage,
    ensureMoney,
    ensureNullableArray,
    ensureNullableMoney,
    ensureNullableString,
    ensureNumber,
    ensureString,
} from './typeGuards'
import { FILTER_GROUP_NAMES } from '@/lib/utils/constants'

const ensureProduct = (product: any): ProductListItem => ({
    availableForSale: ensureBoolean(product.availableForSale),
    featuredImage: ensureImage(product.featuredImage),
    handle: ensureString(product.handle),
    id: ensureString(product.id),
    price: ensureMoney(product.priceRange.maxVariantPrice),
    title: ensureString(product.title),
    totalInventory: ensureNumber(product.totalInventory),
    compareAtPrice: ensureNullableMoney(product.compareAtPrice),
})

const ensureFilterOption = (filterOption: any): FilterOption => ({
    name: ensureString(filterOption.name),
    isSelected: ensureBoolean(filterOption.isSelected),
})

const ensureFilterGroup = (filterGroup: any): FilterGroup => ({
    groupName: ensureString(filterGroup.groupName),
    isActive: ensureBoolean(filterGroup.isActive),
    options: ensureArray(filterGroup.options, ensureFilterOption),
})

const ensureCollectionLink = (relatedCollection: any): CollectionLink => ({
    handle: ensureString(relatedCollection.handle),
    title: ensureString(relatedCollection.title),
})

export const validateCollection = (collection: any): Omit<Collection, 'maxPrice'> => {
    const error = new Error('Safe collection conversion failed')
    if (collection == undefined) {
        console.error(error)
        throw error
    }

    const filterGroups = collection?.products?.filters
        ?.filter((filter: any) => {
            return FILTER_GROUP_NAMES.includes(filter.label.toLowerCase())
        })
        ?.map((filter: any) => {
            return {
                groupName: filter.label.toLowerCase(),
                isActive: false,
                options: filter.values
                    .filter((value: any) => value.count > 0)
                    .map((value: any) => ({
                        name: value.label,
                        isSelected: false,
                    })),
            }
        })

    const priceInput = JSON.parse(
        collection?.products?.filters
            ?.find((filter: any) => filter.label === 'Price')
            ?.values.find((value: any) => value.label === 'Price')?.input,
    )

    const priceFilter = [priceInput?.price.min, priceInput?.price.max]

    const totalProductCount = collection?.products?.filters
        ?.find((filter: any) => filter.label === 'Availability')
        ?.values.find((value: any) => value.label === 'In stock')?.count

    const departmentMetafield = collection?.metafields?.find(
        (metafield: any) => metafield?.key === 'department',
    )
    const relatedCollectionsMetafield = collection?.metafields?.find(
        (metafield: any) => metafield?.key === 'related_collections',
    )
    try {
        const safeCollection = {
            department: ensureNullableString(departmentMetafield?.value),
            filterGroups: ensureArray(filterGroups, ensureFilterGroup),
            hasNextPage: ensureBoolean(collection.products.pageInfo.hasNextPage),
            priceFilter: ensureArray(priceFilter, ensureNumber),
            products: ensureArray(collection.products.nodes, ensureProduct),
            relatedCollections: ensureNullableArray(
                relatedCollectionsMetafield?.references?.nodes,
                ensureCollectionLink,
            ),
            title: ensureString(collection.title),
            totalProductCount: ensureNumber(totalProductCount),
            endCursor: ensureNullableString(collection.products.pageInfo.endCursor),
        }

        return safeCollection
    } catch (error) {
        console.error(error)
        throw error
    }
}
