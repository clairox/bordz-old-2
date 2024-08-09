import { NextRequest, NextResponse } from 'next/server'
import { handleErrorResponse } from '@/lib/utils/api'
import { serialize } from 'cookie'
import { createCart, createCustomer } from './common/requestHandlers'

export const POST = async (request: NextRequest) => {
	const { email, password, firstName, lastName, birthDate, phone, wishlist } = await request.json()

	try {
		const { id: cartId } = await createCart()
		const { customer, customerAccessToken } = await createCustomer(
			email,
			password,
			firstName,
			lastName,
			new Date(birthDate),
			cartId,
			wishlist,
			phone
		)

		const { accessToken, expiresAt } = customerAccessToken

		const expiryTime = new Date(expiresAt).getTime()
		const now = new Date().getTime()
		const cookie = serialize('customerAccessToken', accessToken, {
			httpOnly: true,
			secure: process.env.NODE_ENV !== 'development',
			maxAge: expiryTime - now,
			sameSite: 'strict',
			path: '/',
		})

		const response = NextResponse.json(customer)
		response.headers.append('Set-Cookie', cookie)
		return response
	} catch (error) {
		return handleErrorResponse(error as Error)
	}
}
