import { handleErrorResponse } from '@/lib/utils/api'
import { NextRequest, NextResponse } from 'next/server'
import { getProduct } from './common/requestHandlers'

export const GET = async (request: NextRequest, context: { params: { handle: string } }) => {
    const { handle } = context.params

    try {
        const product = await getProduct(handle)

        const response = NextResponse.json(product)
        return response
    } catch (error) {
        return handleErrorResponse(error as Error)
    }
}
