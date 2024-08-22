import { NextRequest, NextResponse } from 'next/server'
import { isNumeric, roundUp } from '@/lib/utils/number'
import { handleErrorResponse } from '@/lib/utils/api'
import { searchParamsToObject } from '@/lib/utils/conversions'
import {
    getCollection,
    getCollectionMaxPrice,
} from '@/lib/services/shopify/requestHandlers/storefront'
import { processPriceParam } from '@/lib/utils/helpers'

export const GET = async (request: NextRequest) => {
    const searchParams = searchParamsToObject(request.nextUrl.searchParams)
    const { handle, subcategory, brand, size, color, price, start, sortBy } = searchParams

    const limit = 40 + (start && isNumeric(start) ? Number(start) : 0)
    const brands = brand?.split(',')
    const sizes = size?.split(',')
    const colors = color?.split(',')
    const priceRange = processPriceParam(price)

    try {
        const collection = await getCollection(
            handle,
            priceRange,
            sortBy,
            subcategory,
            limit,
            brands,
            sizes,
            colors,
        )

        const maxPrice = await getCollectionMaxPrice(
            handle,
            subcategory,
            limit,
            brands,
            sizes,
            colors,
        )

        const response = NextResponse.json({ ...collection, maxPrice: roundUp(maxPrice) })
        return response
    } catch (error) {
        return handleErrorResponse(error as Error)
    }
}
