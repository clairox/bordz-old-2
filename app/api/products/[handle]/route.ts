import { getProduct } from '@/lib/services/shopify/requestHandlers/storefront'
import { handleErrorResponse } from '@/lib/utils/api'
import { NextRequest, NextResponse } from 'next/server'

export const GET = async (request: NextRequest, context: { params: { handle: string } }) => {
    const { handle } = context.params

    try {
        const product = await getProduct(handle)
        return NextResponse.json(product)
    } catch (error) {
        return handleErrorResponse(error as Error)
    }
}
