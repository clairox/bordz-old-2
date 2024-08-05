import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/prisma/client'
import { APIError, defaultErrorResponse } from '@/lib/utils/api'
import { createCart, signup } from './utils'

export const POST = async (request: NextRequest) => {
	const { firstName, lastName, email, password, birthDate } = await request.json()

	try {
		const cart = await createCart()
		const customer = await signup(email, password, firstName, lastName)

		const internalCustomer = await prisma.customer.create({
			data: {
				id: customer.id,
				cartId: cart.id,
				birthDate: new Date(birthDate),
			},
		})

		const cartIdParts = internalCustomer.cartId.split('/')
		const cartIdStripped = cartIdParts[cartIdParts.length - 1]

		const response = NextResponse.json({ email: customer.email, cartId: cartIdStripped })
		response.headers.append('Access-Control-Allow-Origin', '*')
		response.headers.append('Access-Control-Allow-Methods', 'POST')
		return response
	} catch (error) {
		if (error instanceof APIError) {
			const { message, code, status } = error
			return NextResponse.json({ message, code }, { status })
		} else {
			return defaultErrorResponse
		}
	}
}
