import { NextRequest, NextResponse } from 'next/server'
import { isNumeric, roundUp } from '@/lib/utils/number'
import { handleErrorResponse } from '@/lib/utils/api'
import { searchParamsToObject } from '@/lib/utils/conversions'
import {
    getCollection,
    getCollectionMaxPrice,
} from '@/lib/services/shopify/requestHandlers/storefront'
import { processPriceParam } from '@/lib/utils/helpers'
import { FILTER_GROUP_NAMES, DEFAULT_COLLECTION_LIMIT } from '@/lib/utils/constants'

export const GET = async (request: NextRequest) => {
    const searchParams = request.nextUrl.searchParams
    const searchParamsObject = searchParamsToObject(searchParams)
    const { handle, price, sz, cursor, sortBy } = searchParamsObject

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
        const collection = await getCollection(
            handle,
            size,
            cursor,
            sortBy,
            priceRange,
            filterGroups,
        )

        const maxPrice = await getCollectionMaxPrice(handle, filterGroups)

        return NextResponse.json({ ...collection, maxPrice: roundUp(maxPrice) })
    } catch (error) {
        return handleErrorResponse(error as Error)
    }
}
