import { GetCustomerQuery } from '@/__generated__/storefront/graphql'
import { DELETE_CUSTOMER } from '@/lib/adminAPI/mutations'
import { getClient } from '@/lib/apollo/apolloClient'
import { UPDATE_CUSTOMER } from '@/lib/storefrontAPI/mutations'
import { GET_CUSTOMER_ID_ONLY } from '@/lib/storefrontAPI/queries'
import prisma from '@/prisma/client'
import { serialize } from 'cookie'
import { GraphQLError, print } from 'graphql'
import { NextRequest, NextResponse } from 'next/server'
import { deleteCustomer, getCustomer, updateCustomer } from './utils'
import { APIError, defaultErrorResponse } from '@/lib/utils/api'

export const PATCH = async (request: NextRequest) => {
	const customerAccessToken = request.cookies.get('customerAccessToken')
	if (!customerAccessToken) {
		return NextResponse.json(
			{ message: 'Missing customer access token', code: 'UNAUTHORIZED' },
			{ status: 401 }
		)
	}

	const { email, password, firstName, lastName } = await request.json()

	try {
		const { customer, newAccessToken } = await updateCustomer(
			customerAccessToken.value,
			email,
			password,
			firstName,
			lastName
		)

		const internalCustomer = await prisma.customer.findUnique({
			where: {
				id: customer.id,
			},
		})

		if (internalCustomer == undefined) {
			return defaultErrorResponse
		}

		const response = NextResponse.json({ customer: internalCustomer })

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

		response.headers.append('Access-Control-Allow-Origin', '*')
		response.headers.append('Access-Control-Allow-Methods', 'PATCH,DELETE')
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

export const DELETE = async (request: NextRequest) => {
	const customerAccessToken = request.cookies.get('customerAccessToken')
	if (!customerAccessToken) {
		return NextResponse.json(
			{ message: 'Missing customer access token', code: 'UNAUTHORIZED' },
			{ status: 401 }
		)
	}

	try {
		const customer = await getCustomer(customerAccessToken.value)
		const deletedCustomerId = await deleteCustomer(customer.id)

		await prisma.customer.delete({
			where: {
				id: deletedCustomerId,
			},
		})

		const response = NextResponse.json({})
		response.headers.append('Access-Control-Allow-Origin', '*')
		response.headers.append('Access-Control-Allow-Methods', 'PATCH,DELETE')
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
