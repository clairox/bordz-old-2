import { getCustomer } from '@/lib/services/shopify/requestHandlers/storefront'
import { handleErrorResponse } from '@/lib/utils/api'
import { extractCustomerAuthData } from '@/lib/utils/helpers'
import { NextRequest, NextResponse } from 'next/server'

export const GET = async (request: NextRequest) => {
    const customerAccessToken = request.cookies.get('customerAccessToken')
    if (customerAccessToken == undefined) {
        return new NextResponse(null, { status: 204 })
    }

    try {
        const customer = await getCustomer(customerAccessToken.value)
        return NextResponse.json(extractCustomerAuthData(customer))
    } catch (error) {
        return handleErrorResponse(error as Error)
    }
}
