import { NextRequest, NextResponse } from 'next/server'
import { processPriceParams } from './common/utils'
import { getCollection, getCollectionMaxPrice } from './common/requestHandlers'
import { isNumeric } from '@/lib/utils/number'
import { handleErrorResponse, makeObjectFromSearchParams } from '@/lib/utils/api'

export const GET = async (request: NextRequest) => {
	const searchParams = makeObjectFromSearchParams(request.nextUrl.searchParams)
	const { handle, subcategory, brand, size, color, priceMin, priceMax, limit, sortBy } =
		searchParams

	const parsedLimit = limit && isNumeric(limit) ? Number(limit) : undefined
	const brands = brand?.split(',')
	const sizes = size?.split(',')
	const colors = color?.split(',')
	const price = processPriceParams(priceMin, priceMax)

	try {
		const collection = await getCollection(
			handle,
			price,
			sortBy,
			subcategory,
			parsedLimit,
			brands,
			sizes,
			colors
		)
		const maxPrice = await getCollectionMaxPrice(
			handle,
			price,
			subcategory,
			parsedLimit,
			brands,
			sizes,
			colors
		)

		const response = NextResponse.json({ ...collection, maxPrice })
		return response
	} catch (error) {
		return handleErrorResponse(error as Error)
	}
}
