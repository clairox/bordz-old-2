import { NextRequest, NextResponse } from 'next/server'
import { getClient } from '@/lib/apollo/apolloClient'
import { CREATE_CART, SIGNUP } from '@/lib/storefrontAPI/mutations'
import prisma from '@/prisma/client'
import { gqlFetcher } from '@/lib/fetcher'
import { print } from 'graphql'

export const POST = async (request: NextRequest) => {
	const { firstName, lastName, email, password, birthDate } = await request.json()

	const storefrontAccessToken = process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN
	if (storefrontAccessToken === undefined) {
		throw new Error('Missing Shopify Storefront access token')
	}

	const { data, errors } = await gqlFetcher({
		api: 'storefront',
		query: print(SIGNUP),
		variables: { firstName, lastName, email, password },
		token: storefrontAccessToken,
	})

	if (errors) {
		const { message, extensions } = errors[0]
		return NextResponse.json({ message, code: extensions.code }, { status: 400 })
	}

	const customerUserErrors = data?.customerCreate?.customerUserErrors
	if (customerUserErrors && customerUserErrors.length > 0) {
		const { code } = customerUserErrors[0]
		switch (code) {
			case 'TAKEN':
				return NextResponse.json(
					{ message: 'An account with this email already exists.', code },
					{ status: 409 }
				)
			default:
				return NextResponse.json(
					{ message: 'Internal Server Error', code: 'INTERNAL_SERVER_ERROR' },
					{ status: 500 }
				)
		}
	}

	const customer = data?.customerCreate?.customer
	if (!customer) {
		return NextResponse.json(
			{ message: 'Internal Server Error', code: 'INTERNAL_SERVER_ERROR' },
			{ status: 500 }
		)
	}

	const { data: cartData, errors: cartErrors } = await getClient().mutate({
		mutation: CREATE_CART,
	})

	if (cartErrors) {
		const { message, extensions } = cartErrors[0]
		return NextResponse.json({ message, code: extensions.code }, { status: 400 })
	}

	const cartUserErrors = cartData?.cartCreate?.userErrors
	if (cartUserErrors && cartUserErrors.length > 0) {
		const { code, message } = cartUserErrors[0]
		return NextResponse.json({ message, code }, { status: 500 })
	}

	const cartId = cartData?.cartCreate?.cart?.id
	if (!cartId) {
		return NextResponse.json(
			{ message: 'Internal Server Error', code: 'INTERNAL_SERVER_ERROR' },
			{ status: 500 }
		)
	}

	try {
		const internalCustomer = await prisma.customer.create({
			data: {
				id: customer.id,
				cartId,
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
		return NextResponse.json(
			{ message: 'Internal Server Error', code: 'INTERNAL_SERVER_ERROR' },
			{ status: 500 }
		)
	}
}
