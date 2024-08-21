import { handleErrorResponse } from '@/lib/utils/api'
import { isNumeric } from '@/lib/utils/number'
import { NextRequest, NextResponse } from 'next/server'
import { getProductVariants } from './common/requestHandlers'

export const POST = async (request: NextRequest) => {
    const { ids, start } = await request.json()
    const limit = 40 + (start && isNumeric(start) ? Number(start) : 0)

    try {
        const { productVariants, hasNextPage } = await getProductVariants(ids, limit)
        return NextResponse.json({ productVariants, hasNextPage })
    } catch (error) {
        return handleErrorResponse(error as Error)
    }
}
