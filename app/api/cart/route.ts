import { NextRequest, NextResponse } from 'next/server'
import { createCart } from './common/requestHandler'
import { handleErrorResponse } from '@/lib/utils/api'

export const POST = async (request: NextRequest) => {
    try {
        const cart = await createCart()
        return NextResponse.json(cart)
    } catch (error) {
        return handleErrorResponse(error as Error)
    }
}
