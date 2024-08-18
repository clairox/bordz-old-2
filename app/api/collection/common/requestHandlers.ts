import { checkGraphQLErrors, storefrontAPIFetcher } from '@/lib/fetcher/fetcher'
import { isSortByKey, makeProductFilters, makeSortInputs } from './utils'
import { GET_COLLECTION, GET_COLLECTION_MAX_PRICE } from '@/lib/storefrontAPI/queries'
import { toSafeProductListItem } from './validators'
import _ from 'lodash'

const convertParamStringToTitle = (value: string) => {
    return _.startCase(value.replace('-', ' '))
}

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
    if (!isSortByKey(sortBy)) {
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
    const variables = {
        handle,
        limit,
        sortKey,
        reverse,
        filters,
    }

    try {
        const { data, errors } = await storefrontAPIFetcher(GET_COLLECTION, { variables })

        checkGraphQLErrors(errors)

        const collection = data?.collection

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

        const safeProducts = products?.map(product => toSafeProductListItem(product))

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

export const getCollectionMaxPrice = async (
    handle: string,
    subcategory?: string,
    limit: number = 40,
    brands: string[] = [],
    sizes: string[] = [],
    colors: string[] = [],
) => {
    const filters = makeProductFilters({
        subcategory,
        brands,
        sizes,
        colors,
        price: [], // NOTE price filter should not influence max price
    })
    const variables = {
        handle,
        limit,
        filters,
    }

    try {
        const { data, errors } = await storefrontAPIFetcher(GET_COLLECTION_MAX_PRICE, { variables })

        checkGraphQLErrors(errors)

        const maxPrice = data?.collection?.products.nodes.reduce(
            (previousPrice, currentProduct) => {
                const currentPrice = Number(currentProduct.priceRange.maxVariantPrice.amount)
                if (currentPrice > previousPrice) {
                    return currentPrice
                }

                return previousPrice
            },
            0,
        )

        if (typeof maxPrice !== 'number') {
            throw new Error('maxPrice is not of number type')
        }

        return maxPrice
    } catch (error) {
        throw error
    }
}
