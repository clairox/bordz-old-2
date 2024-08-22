import { ProductCollectionSortKeys } from '@/__generated__/storefront/graphql'
import { GET_COLLECTION } from '@/lib/graphql/shopify/storefront/queries'
import { CollectionSortKeyAlias } from '@/types/store'
import { storefrontClient } from './base'
import _ from 'lodash'
import { validateCollectionItem } from '@/lib/services/shopify/validators'
import { makeProductFilters } from '@/lib/utils/helpers'

export const getCollection = async (
    handle: string,
    priceRange: number[],
    sortBy: string,
    subcategory?: string,
    limit: number = 40,
    brands: string[] = [],
    sizes: string[] = [],
    colors: string[] = [],
) => {
    if (!isValidSortKey(sortBy)) {
        sortBy = 'recommended'
    }

    const filters = makeProductFilters({
        subcategory,
        brands,
        sizes,
        colors,
        price: priceRange,
    })
    const { sortKey, reverse } = makeSortInputs(sortBy)
    const config = {
        variables: {
            handle,
            limit,
            sortKey,
            reverse,
            filters,
        },
    }

    try {
        const { collection } = await storefrontClient(GET_COLLECTION, 'collection', config)

        const products = collection?.products.nodes
        const hasNextPage = collection?.products.pageInfo.hasNextPage
        let title = collection?.title

        if (typeof hasNextPage !== 'boolean') {
            throw new Error('hasNextPage is not of boolean type')
        }

        if (typeof title !== 'string') {
            throw new Error('title is not of string type')
        } else if (subcategory) {
            title = convertParamStringToTitle(subcategory)
        }

        if (!Array.isArray(products)) {
            throw new Error('Products are not of array type')
        }

        const safeProducts = products?.map(product => validateCollectionItem(product))

        const productCount = collection?.products.filters
            ?.find(filter => filter.label === 'Availability')
            ?.values.find(value => value.label === 'In stock')?.count

        if (typeof productCount !== 'number') {
            throw new Error('productCount is not of number type')
        }

        const subcategoryTitles: string[] | undefined = subcategory
            ? []
            : collection?.products.filters
                  ?.find(filter => filter.label === 'Subcollection')
                  ?.values.map(value => convertParamStringToTitle(value.label))

        return { title, subcategoryTitles, products: safeProducts, hasNextPage, productCount }
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

const convertParamStringToTitle = (value: string) => {
    return _.startCase(value.replace('-', ' '))
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
