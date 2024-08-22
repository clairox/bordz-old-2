import { handleErrorResponse } from '@/lib/utils/api'
import { NextRequest, NextResponse } from 'next/server'
import { serialize } from 'cookie'
import { getCustomer, updateCustomer } from '@/lib/services/shopify/requestHandlers/storefront'
import { deleteCustomer } from '@/lib/services/shopify/requestHandlers/admin'

export const GET = async (request: NextRequest) => {
    const customerAccessToken = request.cookies.get('customerAccessToken')
    if (!customerAccessToken) {
        return NextResponse.json(
            { message: 'Missing customer access token', code: 'UNAUTHORIZED' },
            { status: 401 },
        )
    }

    try {
        const customer = await getCustomer(customerAccessToken.value)
        return NextResponse.json(customer)
    } catch (error) {
        return handleErrorResponse(error as Error)
    }
}

export const PATCH = async (request: NextRequest) => {
    const customerAccessToken = request.cookies.get('customerAccessToken')
    if (!customerAccessToken) {
        return NextResponse.json(
            { message: 'Missing customer access token', code: 'UNAUTHORIZED' },
            { status: 401 },
        )
    }

    const body = await request.json()

    const values = {
        email: body.email,
        password: body.password,
        firstName: body.firstName,
        lastName: body.lastName,
        birthDate: body.birthDate,
        phone: body.phone,
        cartId: body.cartId,
        wishlist: body.wishlist,
    }

    try {
        const { customer, newAccessToken } = await updateCustomer(customerAccessToken.value, values)

        const response = NextResponse.json(customer)
        if (newAccessToken) {
            const { accessToken, expiresAt } = newAccessToken

            const expiryTime = new Date(expiresAt).getTime()
            const now = new Date().getTime()
            const cookie = serialize('customerAccessToken', accessToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV !== 'development',
                maxAge: expiryTime - now,
                sameSite: 'strict',
                path: '/',
            })

            response.headers.append('Set-Cookie', cookie)
        }

        return response
    } catch (error) {
        return handleErrorResponse(error as Error)
    }
}

export const DELETE = async (request: NextRequest) => {
    const customerAccessToken = request.cookies.get('customerAccessToken')
    if (!customerAccessToken) {
        return NextResponse.json(
            { message: 'Missing customer access token', code: 'UNAUTHORIZED' },
            { status: 401 },
        )
    }

    const { id } = await request.json()

    try {
        await deleteCustomer(id)
        return new NextResponse(null, { status: 204 })
    } catch (error) {
        return handleErrorResponse(error as Error)
    }
}
