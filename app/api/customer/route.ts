import { getClient } from '@/lib/apollo/apolloClient'
import { UPDATE_CUSTOMER } from '@/lib/mutations'
import { GET_CUSTOMER } from '@/lib/queries'
import { serialize } from 'cookie'
import { NextRequest, NextResponse } from 'next/server'

export const GET = async (request: NextRequest) => {
	const customerAccessToken = request.cookies.get('customerAccessToken')
	if (!customerAccessToken) {
		return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
	}

	const { data, errors } = await getClient().query({
		query: GET_CUSTOMER,
		variables: { customerAccessToken: customerAccessToken.value },
	})

	if (errors) {
		const { message } = errors[0]
		return NextResponse.json({ error: message }, { status: 400 })
	}
	const customer = data?.customer
	if (!customer) {
		return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
	}

	const { __typename, ...rest } = customer
	return NextResponse.json(rest)
}

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

// TODO: !! Make middleware for customerAccessToken cookie
