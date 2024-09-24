import {
    getProductSearchResults,
    getProductSearchResultsMaxPrice,
} from '@/lib/services/shopify/requestHandlers/storefront'
import { handleErrorResponse } from '@/lib/utils/api'
import { DEFAULT_COLLECTION_LIMIT, FILTER_GROUP_NAMES } from '@/lib/utils/constants'
import { searchParamsToObject } from '@/lib/utils/conversions'
import { processPriceParam } from '@/lib/utils/helpers'
import { NextRequest, NextResponse } from 'next/server'

export const GET = async (request: NextRequest) => {
    const searchParams = request.nextUrl.searchParams
    const { q: query, price, sz, cursor, sortBy } = searchParamsToObject(searchParams)

    const priceRange = processPriceParam(price)
    const size = Number(sz) || DEFAULT_COLLECTION_LIMIT

    const filterGroups: Record<string, string[]> = {}
    Array.from(searchParams.entries())
        .filter(entry => {
            const [key] = entry
            return FILTER_GROUP_NAMES.includes(key)
        })
        .forEach(entry => {
            const [key, value] = entry
            filterGroups[key] = value.split(',')
        })

    try {
        const searchResultsData = await getProductSearchResults(
            query,
            size,
            cursor,
            sortBy,
            priceRange,
            filterGroups,
        )

        if (searchResultsData == undefined) {
            return NextResponse.json({
                filterGroups: [],
                hasNextPage: false,
                maxPrice: 0,
                priceFilter: [],
                products: [],
                totalProductCount: 0,
                endCursor: '',
            })
        }

        const maxPrice = await getProductSearchResultsMaxPrice(query)

        return NextResponse.json({ ...searchResultsData, maxPrice })
    } catch (error) {
        return handleErrorResponse(error as Error)
    }
}
