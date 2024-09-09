import { NextRequest, NextResponse } from 'next/server'
import { handleErrorResponse } from '@/lib/utils/api'
import { createCart } from '@/lib/services/shopify/requestHandlers/storefront'

export const POST = async (request: NextRequest) => {
    try {
        const cart = await createCart()
        return NextResponse.json(cart)
    } catch (error) {
        return handleErrorResponse(error as Error)
    }
}
