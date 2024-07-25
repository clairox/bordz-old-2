import { getClient } from '@/lib/apollo/apolloClient'
import { UPDATE_CUSTOMER } from '@/lib/mutations'
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

	return response
}

type CustomerDeleteResponse = {
	customerDelete: {
		deletedCustomerId: string
		userErrors: [
			{
				field: string[]
				message: string
			}
		]
	}
}

const gql = String.raw

const getCustomerQuery = async (customerAccessToken: string) => {
	const response = await fetch(process.env.NEXT_PUBLIC_SHOPIFY_BASE_URL!, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			'X-Shopify-Storefront-Access-Token': process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN!,
		},
		body: JSON.stringify({
			query: gql`
				query Customer($customerAccessToken: String!) {
					customer(customerAccessToken: $customerAccessToken) {
						id
					}
				}
			`,
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

	const response = await fetch(process.env.SHOPIFY_ADMIN_BASE_URL!, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			'X-Shopify-Access-Token': process.env.SHOPIFY_ADMIN_API_ACCESS_TOKEN!,
		},
		body: JSON.stringify({
			query: gql`
				mutation CustomerDelete($id: ID!) {
					customerDelete(input: { id: $id }) {
						deletedCustomerId
						userErrors {
							field
							message
						}
					}
				}
			`,
			variables: { id: data.customer.id },
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

	return NextResponse.json(await response.json())
}

// TODO: !! Make middleware for customerAccessToken cookie
