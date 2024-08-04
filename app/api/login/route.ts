import { NextRequest, NextResponse } from 'next/server'
import { getClient } from '@/lib/apollo/apolloClient'
import { LOGIN } from '@/lib/storefrontAPI/mutations'
import { serialize } from 'cookie'
import { gqlFetcher } from '@/lib/fetcher/fetcher'
import { print } from 'graphql'

export const POST = async (request: NextRequest) => {
	const { email, password } = await request.json()

	const storefrontAccessToken = process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN
	if (storefrontAccessToken === undefined) {
		throw new Error('Missing Shopify Storefront access token')
	}

	const { data, errors } = await gqlFetcher({
		api: 'storefront',
		query: print(LOGIN),
		variables: { email, password },
		token: storefrontAccessToken,
	})

	if (errors) {
		const { message, extensions } = errors[0]
		return NextResponse.json({ message, code: extensions.code }, { status: 400 })
	}

	const customerUserErrors = data?.customerAccessTokenCreate?.customerUserErrors
	if (customerUserErrors && customerUserErrors.length > 0) {
		const { code, field } = customerUserErrors[0]
		switch (code) {
			case 'UNIDENTIFIED_CUSTOMER':
				return NextResponse.json(
					{ message: 'Login failed. Please verify your email and password.', code },
					{ status: 401 }
				)
			default:
				return NextResponse.json(
					{ message: 'Internal Server Error', code: 'INTERNAL_SERVER_ERROR' },
					{ status: 500 }
				)
		}
	}

	const customerAccessToken = data?.customerAccessTokenCreate?.customerAccessToken
	if (!customerAccessToken) {
		return NextResponse.json(
			{ message: 'Internal Server Error', code: 'INTERNAL_SERVER_ERROR' },
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

	const response = NextResponse.json({})
	response.headers.append('Set-Cookie', cookie)
	response.headers.append('Access-Control-Allow-Origin', '*')
	response.headers.append('Access-Control-Allow-Methods', 'POST')
	return response
}
