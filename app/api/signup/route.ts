import { NextRequest, NextResponse } from 'next/server'
import { handleErrorResponse } from '@/lib/utils/api'
import { serialize } from 'cookie'
import {
    addCartLines,
    createCart,
    createCustomer,
    getCart,
} from '@/lib/services/shopify/requestHandlers/storefront'
import { extractCustomerAuthData } from '@/lib/utils/helpers'

export const POST = async (request: NextRequest) => {
    const {
        email,
        password,
        firstName,
        lastName,
        birthDate,
        phone,
        guestCartId,
        guestSavedItemsIds: savedItemsIds,
    } = await request.json()

    try {
        const cart = await createCart()
        const { customer, customerAccessToken } = await createCustomer(
            email,
            password,
            firstName,
            lastName,
            new Date(birthDate),
            cart.id,
            savedItemsIds,
            phone,
        )

        const { accessToken, expiresAt } = customerAccessToken

        const guestCart = await getCart(guestCartId)
        const { id: cartId } = await addCartLines(
            cart.id,
            guestCart.lines.map(line => ({
                merchandiseId: line.merchandise.id,
                quantity: line.quantity,
            })),
        )

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
            savedItemsIds: customer.savedItemsIds,
        })
        response.headers.append('Set-Cookie', cookie)
        return response
    } catch (error) {
        return handleErrorResponse(error as Error)
    }
}
