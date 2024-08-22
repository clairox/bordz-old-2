import { searchParamsToObject } from '@/lib/utils/conversions'
import { isNumeric } from '@/lib/utils/number'
import { NextRequest, NextResponse } from 'next/server'
import { handleErrorResponse } from '@/lib/utils/api'
import { isValidPriceRange } from '@/lib/core/collections'
import { getProductFilters } from '@/lib/services/shopify/requestHandlers/storefront/getProductFilters'
import { processPriceParam } from '@/lib/utils/helpers'

export const GET = async (request: NextRequest) => {
    const searchParams = searchParamsToObject(request.nextUrl.searchParams)
    const { handle, subcategory, brand, size, color, price, start } = searchParams

    const limit = 40 + (start && isNumeric(start) ? Number(start) : 0)
    const brands = brand?.split(',')
    const sizes = size?.split(',')
    const colors = color?.split(',')
    const priceRange = processPriceParam(price)

    try {
        const productFilters = await getProductFilters(
            handle,
            priceRange,
            subcategory,
            limit,
            brands,
            sizes,
            colors,
        )

        const selectedProductFilters: Record<string, string[]> = {}
        if (brands?.length > 0) {
            selectedProductFilters['brand'] = brands
        }

        if (sizes?.length > 0) {
            selectedProductFilters['size'] = sizes
        }

        if (colors?.length > 0) {
            selectedProductFilters['color'] = colors
        }

        if (isValidPriceRange(priceRange)) {
            selectedProductFilters['price'] = [priceRange[0].toString(), priceRange[1].toString()]
        }

        const response = NextResponse.json({ productFilters, selectedProductFilters })
        return response
    } catch (error) {
        return handleErrorResponse(error as Error)
    }
}
