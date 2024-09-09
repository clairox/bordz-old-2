import { getProductVariants } from '@/lib/services/shopify/requestHandlers/admin'
import { handleErrorResponse } from '@/lib/utils/api'
import { DEFAULT_COLLECTION_LIMIT } from '@/lib/utils/constants'
import { isNumeric } from '@/lib/utils/number'
import { NextRequest, NextResponse } from 'next/server'

export const POST = async (request: NextRequest) => {
    const { ids, sz, cursor } = await request.json()
    const size = Number(sz) || DEFAULT_COLLECTION_LIMIT

    try {
        const { productVariants, hasNextPage, endCursor } = await getProductVariants(
            ids,
            size,
            cursor,
        )
        return NextResponse.json({ productVariants, hasNextPage, endCursor })
    } catch (error) {
        return handleErrorResponse(error as Error)
    }
}
