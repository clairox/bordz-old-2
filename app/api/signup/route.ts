import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/prisma/client'
import { APIError, DEFAULT_ERROR_RESPONSE } from '@/lib/utils/api'
import { createCart, signup } from './utils'

export const POST = async (request: NextRequest) => {
	const { firstName, lastName, email, password, birthDate, wishlist } = await request.json()

	try {
		const { cart } = await createCart()
		const { customer } = await signup(email, password, firstName, lastName)

		const internalCustomer = await prisma.customer.create({
			data: {
				id: customer.id,
				cartId: cart.id,
				birthDate: new Date(birthDate),
				wishlist: (wishlist as string[]) || [],
			},
		})

		const response = NextResponse.json({ email: customer.email, cartId: internalCustomer.cartId })
		response.headers.append('Access-Control-Allow-Origin', '*')
		return response
	} catch (error) {
		if (error instanceof APIError) {
			const { message, code, status } = error
			return NextResponse.json({ message, code }, { status })
		} else {
			return DEFAULT_ERROR_RESPONSE
		}
	}
}
