import { createCustomerAccessToken } from '@/lib/services/shopify/requestHandlers/storefront'
import { handleErrorResponse } from '@/lib/utils/api'
import { NextRequest, NextResponse } from 'next/server'

export const POST = async (request: NextRequest) => {
    const { email, password } = await request.json()

    try {
        await createCustomerAccessToken(email, password)
        return new NextResponse(null, { status: 204 })
    } catch (error) {
        return handleErrorResponse(error as Error)
    }
}
