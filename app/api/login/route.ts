import { NextRequest, NextResponse } from 'next/server'
import { getClient } from '@/lib/apollo/apolloClient'
import { LOGIN } from '@/lib/mutations'
import { serialize } from 'cookie'

export const POST = async (request: NextRequest) => {
	const { email, password } = await request.json()

	const { data, errors } = await getClient().mutate({
		mutation: LOGIN,
		variables: { email, password },
	})

	if (errors) {
		const { message } = errors[0]
		return NextResponse.json({ error: { code: 'GRAPHQL_ERROR', message } }, { status: 400 })
	}

	const customerUserErrors = data?.customerAccessTokenCreate?.customerUserErrors
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

	const customerAccessToken = data?.customerAccessTokenCreate?.customerAccessToken
	if (!customerAccessToken) {
		return NextResponse.json(
			{ error: { code: 'INTERNAL_SERVER_ERROR', message: 'Internal Server Error' } },
			{ status: 500 }
		)
	}

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

	const res = NextResponse.json({ success: true })
	res.headers.append('Set-Cookie', cookie)
	return res
}

// TODO: Renew access token if expired I guess?
