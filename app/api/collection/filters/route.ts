import { searchParamsToObject } from '@/lib/utils/conversions'
import { NextRequest, NextResponse } from 'next/server'
import { handleErrorResponse } from '@/lib/utils/api'
import { getProductFilters } from '@/lib/services/shopify/requestHandlers/storefront/getProductFilters'
import { processPriceParam } from '@/lib/utils/helpers'
import { DEFAULT_COLLECTION_LIMIT, FILTER_GROUP_NAMES } from '@/lib/utils/constants'

export const GET = async (request: NextRequest) => {
    const searchParams = request.nextUrl.searchParams
    const searchParamsObject = searchParamsToObject(searchParams)
    const { handle, price, sz } = searchParamsObject

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
        const productFilters = await getProductFilters(handle, size, priceRange, filterGroups)

        const response = NextResponse.json({ productFilters })
        return response
    } catch (error) {
        return handleErrorResponse(error as Error)
    }
}
