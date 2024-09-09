import { GET_PRODUCT_FILTERS } from '@/lib/graphql/shopify/storefront/queries'
import { makeProductFilters } from '@/lib/utils/helpers'
import { storefrontClient } from './base'

export const getProductFilters = async (
    handle: string,
    size: number,
    priceRange: number[],
    filterGroups: Record<string, string[]>,
) => {
    const filters = makeProductFilters(filterGroups, priceRange)

    const config = {
        variables: {
            handle,
            first: size,
            filters,
        },
    }

    try {
        const { collection } = await storefrontClient(GET_PRODUCT_FILTERS, 'collection', config)

        const fetchedFilters = collection?.products?.filters
        if (fetchedFilters == undefined) {
            throw new Error('An error occurred while fetching filters')
        }

        const productFilters: Record<string, string[]> = {}

        fetchedFilters
            .filter(filter => {
                const labels = ['Brand', 'Size', 'Color']
                return labels.includes(filter.label)
            })
            .forEach(filter => {
                const key = filter.label.toLowerCase()
                const values = filter.values
                    .filter(value => value.count > 0)
                    .map(value => value.label)
                productFilters[key] = values
            })

        const priceFilter = JSON.parse(
            fetchedFilters
                .find(filter => filter.label === 'Price')
                ?.values.find(value => value.label === 'Price')?.input,
        ).price

        productFilters.price = [priceFilter.min, priceFilter.max]

        return productFilters
    } catch (error) {
        throw error
    }
}
