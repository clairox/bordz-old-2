import { ProductSearchResults, FilterGroup, FilterOption, ProductListItem } from '@/types/store'
import {
    ensureArray,
    ensureBoolean,
    ensureImage,
    ensureMoney,
    ensureNullableMoney,
    ensureNullableString,
    ensureNumber,
    ensureString,
} from './typeGuards'
import { FILTER_GROUP_NAMES } from '@/lib/utils/constants'
import { roundUp } from '@/lib/utils/number'

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

export const validateProductSearchResults = (
    searchResults: any,
): Omit<ProductSearchResults, 'maxPrice'> => {
    const error = new Error('Safe product search results conversion failed')
    if (searchResults == undefined) {
        console.error(error)
        throw error
    }

    const filterGroups = searchResults?.productFilters
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
        searchResults?.productFilters
            ?.find((filter: any) => filter.label === 'Price')
            ?.values.find((value: any) => value.label === 'Price')?.input,
    )

    const priceFilter = [roundUp(priceInput?.price.min), roundUp(priceInput?.price.max)]

    const totalProductCount = searchResults?.productFilters
        ?.find((filter: any) => filter.label === 'Availability')
        ?.values.find((value: any) => value.label === 'In stock')?.count

    try {
        const safeSearchResults = {
            filterGroups: ensureArray(filterGroups, ensureFilterGroup),
            hasNextPage: ensureBoolean(searchResults.pageInfo.hasNextPage),
            priceFilter: ensureArray(priceFilter, ensureNumber),
            products: ensureArray(searchResults.nodes, ensureProduct),
            totalProductCount: ensureNumber(totalProductCount),
            endCursor: ensureNullableString(searchResults.pageInfo.endCursor),
        }

        return safeSearchResults
    } catch (error) {
        console.error(error)
        throw error
    }
}
