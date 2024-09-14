import { NextRequest, NextResponse } from 'next/server'
import { serialize } from 'cookie'
import { handleErrorResponse } from '@/lib/utils/api'
import {
    addCartLines,
    createCustomerAccessToken,
    getCart,
    getCustomer,
} from '@/lib/services/shopify/requestHandlers/storefront'
import { addSavedItems } from '@/lib/services/shopify/requestHandlers/admin'
import { extractCustomerAuthData } from '@/lib/utils/helpers'

export const POST = async (request: NextRequest) => {
    const { email, password, guestCartId, guestSavedItemsIds } = await request.json()

    try {
        const customerAccessToken = await createCustomerAccessToken(email, password)
        const { accessToken, expiresAt } = customerAccessToken

        // Merge guest cart into customer cart and wishlist
        // into customer wishlist
        const customer = await getCustomer(accessToken)

        const guestCart = await getCart(guestCartId)
        const { id: cartId } = await addCartLines(
            customer.cartId,
            guestCart.lines.map(line => ({
                merchandiseId: line.merchandise.id,
                quantity: line.quantity,
            })),
        )
        const savedItemsIds = await addSavedItems(accessToken, guestSavedItemsIds)

        const expiryTime = new Date(expiresAt).getTime()
        const now = new Date().getTime()
        const cookie = serialize('customerAccessToken', accessToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV !== 'development',
            maxAge: expiryTime - now,
            sameSite: 'strict',
            path: '/',
        })

        const response = NextResponse.json({
            data: extractCustomerAuthData(customer),
            cartId,
            savedItemsIds,
        })
        response.headers.append('Set-Cookie', cookie)
        return response
    } catch (error) {
        return handleErrorResponse(error as Error)
    }
}
