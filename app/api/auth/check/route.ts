import { getCustomerId } from '@/lib/services/shopify/requestHandlers/storefront'
import { handleErrorResponse } from '@/lib/utils/api'
import { NextRequest, NextResponse } from 'next/server'

export const GET = async (request: NextRequest) => {
    const customerAccessToken = request.cookies.get('customerAccessToken')
    if (customerAccessToken == undefined) {
        return new NextResponse(null, { status: 204 })
    }

    try {
        const id = await getCustomerId(customerAccessToken.value)
        return NextResponse.json({ id })
    } catch (error) {
        return handleErrorResponse(error as Error)
    }
}
