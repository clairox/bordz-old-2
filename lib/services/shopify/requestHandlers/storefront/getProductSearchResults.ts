import { GET_PRODUCT_SEARCH } from '@/lib/graphql/shopify/storefront/queries'
import { makeProductFilters } from '@/lib/utils/helpers'
import { storefrontClient } from './base'
import { FILTER_GROUP_NAMES } from '@/lib/utils/constants'
import { SearchSortKeys } from '@/__generated__/storefront/graphql'
import { ProductSearchResultsSortKeyAlias } from '@/types/store'
import { validateProductSearchResults } from '@/lib/services/shopify/validators/productSearchResults'

export const getProductSearchResults = async (
    query: string,
    size: number,
    cursor: string,
    sortBy: string,
    priceRange: number[],
    filterGroups: Record<string, string[]>,
) => {
    if (!isValidSortKey(sortBy)) {
        sortBy = 'newest'
    }
    const { sortKey, reverse } = makeSortInputs(sortBy)

    const filters = makeProductFilters(filterGroups, priceRange)

    const config = {
        variables: {
            query,
            first: size,
            after: cursor,
            sortKey,
            reverse,
            filters,
        },
    }

    try {
        const { search } = await storefrontClient(GET_PRODUCT_SEARCH, 'search', config)

        if (search?.nodes.length === 0) {
            return undefined
        }

        const safeSearchResults = validateProductSearchResults(search)

        // NOTE: Any selected filter options which are not returned from GET_PRODUCT_SEARCH
        // query will be added to the filterGroups options as they are currently selected
        // and should be returned alongside them
        const unavailableSelectedOptions: Record<string, string[]> = {}

        const allFilterGroups = search?.productFilters
            ?.filter((filter: any) => {
                return FILTER_GROUP_NAMES.includes(filter.label.toLowerCase())
            })
            ?.map((filter: any) => {
                return {
                    groupName: filter.label.toLowerCase(),
                    options: filter.values.map((value: any) => value.label),
                }
            })

        Object.keys(filterGroups)
            .filter(key => key !== 'price')
            .forEach(key => {
                const values: string[] = []
                filterGroups[key].forEach(value => {
                    const isInSearchFilters = safeSearchResults.filterGroups
                        .find(group => group.groupName === key)
                        ?.options.map(option => option.name)
                        .includes(value)

                    const isInAllFilters = allFilterGroups
                        ?.find(group => group.groupName === key)
                        ?.options.includes(value)

                    if (!isInSearchFilters && isInAllFilters) {
                        values.push(value)
                    }
                })

                unavailableSelectedOptions[key] = values
            })

        // Select filter options that were queried and add the ones not
        // returned by GET_COLLECTION query
        safeSearchResults.filterGroups = safeSearchResults.filterGroups.map(group => {
            let isActive = false
            const options = group.options.map(option => {
                if (filterGroups[group.groupName]?.includes(option.name)) {
                    isActive = true
                    // TODO: add group and name to a list or something and get all
                    // the ones that aren't in that list and then check them against
                    // allFilterGroups
                    return {
                        ...option,
                        isSelected: true,
                    }
                }
                return option
            })

            const values = unavailableSelectedOptions[group.groupName]
            if (values == undefined) {
                return { ...group, isActive, options }
            }

            return {
                ...group,
                isActive: true,
                options: options.concat(
                    values.map(value => ({
                        name: value,
                        isSelected: true,
                    })),
                ),
            }
        })

        return safeSearchResults
    } catch (error) {
        throw error
    }
}

const makeSortInputs = (sortBy: string | undefined) => {
    const { Relevance, Price } = SearchSortKeys
    switch (sortBy) {
        case 'relevance':
            return { sortKey: Relevance, reverse: true }
        case 'priceLowToHigh':
            return { sortKey: Price, reverse: false }
        case 'priceHighToLow':
            return { sortKey: Price, reverse: true }
        default:
            return { sortKey: Relevance, reverse: true }
    }
}

const isValidSortKey = (value: string | undefined): value is ProductSearchResultsSortKeyAlias => {
    const sortBy: ProductSearchResultsSortKeyAlias[] = [
        'relevance',
        'priceLowToHigh',
        'priceHighToLow',
    ]
    return sortBy.includes(value as ProductSearchResultsSortKeyAlias)
}
