import { NextRequest, NextResponse } from 'next/server'
import { processPriceParam } from './common/utils'
import { getCollection, getCollectionMaxPrice } from './common/requestHandlers'
import { isNumeric, roundUp } from '@/lib/utils/number'
import { handleErrorResponse } from '@/lib/utils/api'
import { searchParamsToObject } from '@/lib/utils/conversions'

export const GET = async (request: NextRequest) => {
	const searchParams = searchParamsToObject(request.nextUrl.searchParams)
	const { handle, subcategory, brand, size, color, price, limit, sortBy } = searchParams

	const parsedLimit = limit && isNumeric(limit) ? Number(limit) : undefined
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
			parsedLimit,
			brands,
			sizes,
			colors
		)

		const maxPrice = await getCollectionMaxPrice(
			handle,
			subcategory,
			parsedLimit,
			brands,
			sizes,
			colors
		)

		const response = NextResponse.json({ ...collection, maxPrice: roundUp(maxPrice) })
		return response
	} catch (error) {
		return handleErrorResponse(error as Error)
	}
}
