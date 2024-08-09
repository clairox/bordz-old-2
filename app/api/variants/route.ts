import { GenericAPIError, DEFAULT_ERROR_RESPONSE } from '@/lib/utils/api'
import { NextRequest, NextResponse } from 'next/server'
import { getVariants } from './utils'
import { toSafeProductVariant } from './utils/typeGuard'

export const POST = async (request: NextRequest) => {
	const { ids, limit } = await request.json()

	if (ids.length === 0) {
		const response = NextResponse.json({ variants: [] })
		response.headers.append('Access-Control-Allow-Origin', '*')
		return response
	}

	try {
		const { variants, hasNextPage } = await getVariants(ids, limit)
		const safeVariants = variants.map(variant => toSafeProductVariant(variant))

		const response = NextResponse.json({ variants: safeVariants, hasNextPage })
		response.headers.append('Access-Control-Allow-Origin', '*')
		return response
	} catch (error) {
		if (error instanceof GenericAPIError) {
			const { message, code, status } = error
			return NextResponse.json({ message, code }, { status })
		} else {
			return DEFAULT_ERROR_RESPONSE
		}
	}
}
