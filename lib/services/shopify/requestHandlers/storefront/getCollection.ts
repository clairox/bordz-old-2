import { ProductCollectionSortKeys } from '@/__generated__/storefront/graphql'
import { GET_COLLECTION } from '@/lib/graphql/shopify/storefront/queries'
import { CollectionSortKeyAlias } from '@/types/store'
import { storefrontClient } from './base'
import _ from 'lodash'
import { makeProductFilters } from '@/lib/utils/helpers'
import { validateCollection } from '@/lib/services/shopify/validators/collection'
import { FILTER_GROUP_NAMES } from '@/lib/utils/constants'

export const getCollection = async (
    handle: string,
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
            handle,
            first: size,
            after: cursor,
            sortKey,
            reverse,
            filters,
        },
    }

    try {
        const { collection } = await storefrontClient(GET_COLLECTION, 'collection', config)

        const safeCollection = validateCollection(collection)

        // NOTE: Any selected filter options which are not returned from GET_COLLECTION
        // query will be added to the filterGroups options as they are currently selected
        // and should be returned alongside them
        const unavailableSelectedOptions: Record<string, string[]> = {}

        const allFilterGroups = collection?.products?.filters
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
                    const isInCollectionFilters = safeCollection.filterGroups
                        .find(group => group.groupName === key)
                        ?.options.map(option => option.name)
                        .includes(value)

                    const isInAllFilters = allFilterGroups
                        ?.find(group => group.groupName === key)
                        ?.options.includes(value)

                    if (!isInCollectionFilters && isInAllFilters) {
                        values.push(value)
                    }
                })

                unavailableSelectedOptions[key] = values
            })

        // Select filter options that were queried and add the ones not
        // returned by GET_COLLECTION query
        safeCollection.filterGroups = safeCollection.filterGroups.map(group => {
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

        return safeCollection
    } catch (error) {
        throw error
    }
}

const makeSortInputs = (sortBy: string | undefined) => {
    const { BestSelling, Created, Price } = ProductCollectionSortKeys
    switch (sortBy) {
        case 'recommended':
            return { sortKey: BestSelling, reverse: true }
        case 'newest':
            return { sortKey: Created, reverse: false }
        case 'priceLowToHigh':
            return { sortKey: Price, reverse: false }
        case 'priceHighToLow':
            return { sortKey: Price, reverse: true }
        default:
            return { sortKey: BestSelling, reverse: true }
    }
}

const isValidSortKey = (value: string | undefined): value is CollectionSortKeyAlias => {
    const sortBy: CollectionSortKeyAlias[] = [
        'recommended',
        'newest',
        'priceLowToHigh',
        'priceHighToLow',
    ]
    return sortBy.includes(value as CollectionSortKeyAlias)
}
