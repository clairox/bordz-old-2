import { DELETE_CUSTOMER } from '@/lib/adminAPI/mutations'
import { getClient } from '@/lib/apollo/apolloClient'
import { UPDATE_CUSTOMER } from '@/lib/storefrontAPI/mutations'
import { GET_CUSTOMER_ID_ONLY } from '@/lib/storefrontAPI/queries'
import { serialize } from 'cookie'
import { NextRequest, NextResponse } from 'next/server'

export const PATCH = async (request: NextRequest) => {
	const customerAccessToken = request.cookies.get('customerAccessToken')
	if (!customerAccessToken) {
		return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
	}

	const { firstName, lastName, email, password } = await request.json()

	const { data, errors } = await getClient().mutate({
		mutation: UPDATE_CUSTOMER,
		variables: {
			customerAccessToken: customerAccessToken.value,
			firstName,
			lastName,
			email,
			password,
		},
	})

	if (errors) {
		const { message } = errors[0]
		return NextResponse.json(
			{ success: false, error: { code: 'GRAPHQL_ERROR', message } },
			{ status: 400 }
		)
	}

	const customerUserErrors = data?.customerUpdate?.customerUserErrors
	if (customerUserErrors && customerUserErrors.length > 0) {
		const { code, field } = customerUserErrors[0]
		switch (code) {
			case 'UNIDENTIFIED_CUSTOMER':
				return NextResponse.json(
					{
						error: {
							code,
							message: 'Login failed. Please verify your email and password.',
							field: field?.at(1),
						},
					},
					{ status: 401 }
				)
			default:
				return NextResponse.json(
					{ error: { code: 'INTERNAL_SERVER_ERROR', message: 'Internal Server Error' } },
					{ status: 500 }
				)
		}
	}

	const customer = data?.customerUpdate?.customer
	if (!customer) {
		return NextResponse.json(
			{ error: { code: 'INTERNAL_SERVER_ERROR', message: 'Internal Server Error' } },
			{ status: 500 }
		)
	}

	const response = NextResponse.json({ success: true, data: customer })

	const newAccessToken = data?.customerUpdate?.customerAccessToken
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
}

const getCustomerQuery = async (customerAccessToken: string) => {
	const response = await fetch(process.env.NEXT_PUBLIC_SHOPIFY_BASE_URL!, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			'X-Shopify-Storefront-Access-Token': process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN!,
		},
		body: JSON.stringify({
			query: print(GET_CUSTOMER_ID_ONLY),
			variables: { customerAccessToken },
		}),
	})

	if (!response.ok) {
		const text = await response.text()

		throw new Error(`
			Failed to fetch data
			Status: ${response.status}
			Response: ${text}
		`)
	}

	return await response.json()
}

export const DELETE = async (request: NextRequest) => {
	const customerAccessToken = request.cookies.get('customerAccessToken')
	if (!customerAccessToken) {
		return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
	}

	const { data } = await getCustomerQuery(customerAccessToken.value)

	const fetchResponse = await fetch(process.env.SHOPIFY_ADMIN_BASE_URL!, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			'X-Shopify-Access-Token': process.env.SHOPIFY_ADMIN_API_ACCESS_TOKEN!,
		},
		body: JSON.stringify({
			query: print(DELETE_CUSTOMER),
			variables: { id: data.customer.id },
		}),
	})

	if (!fetchResponse.ok) {
		const text = await fetchResponse.text()
		throw new Error(`
			Failed to fetch data
			Status: ${fetchResponse.status}
			Response: ${text}
		`)
	}

	const response = NextResponse.json(await fetchResponse.json())
	response.headers.append('Access-Control-Allow-Origin', '*')
	response.headers.append('Access-Control-Allow-Methods', 'PATCH,DELETE')
	return response
}
