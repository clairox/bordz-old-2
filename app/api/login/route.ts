import { NextRequest, NextResponse } from 'next/server'
import { getClient } from '@/lib/apollo/apolloClient'
import { LOGIN } from '@/lib/mutations'
import { serialize } from 'cookie'

export const POST = async (request: NextRequest) => {
	const { email, password } = await request.json()

	const { data: loginResponseData, errors: loginResponseErrors } = await getClient().mutate({
		mutation: LOGIN,
		variables: { email, password },
	})

	if (loginResponseErrors) {
		const { message } = loginResponseErrors[0]
		return NextResponse.json({ error: message }, { status: 400 })
	}

	const customerUserErrors = loginResponseData?.customerAccessTokenCreate?.customerUserErrors
	if (customerUserErrors && customerUserErrors.length > 0) {
		const { message } = customerUserErrors[0]
		return NextResponse.json({ error: message }, { status: 401 })
	}

	const customerAccessToken = loginResponseData?.customerAccessTokenCreate?.customerAccessToken
	if (!customerAccessToken) {
		return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
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
