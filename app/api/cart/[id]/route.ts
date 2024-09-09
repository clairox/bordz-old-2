import { getCart } from '@/lib/services/shopify/requestHandlers/storefront'
import { handleErrorResponse } from '@/lib/utils/api'
import { NextRequest, NextResponse } from 'next/server'

export const GET = async (request: NextRequest, context: { params: { id: string } }) => {
    const { id } = context.params

    try {
        const cart = await getCart(id)
        return NextResponse.json(cart)
    } catch (error) {
        return handleErrorResponse(error as Error)
    }
}
