import { NextRequest, NextResponse } from 'next/server'
import { getClient } from '@/lib/apollo/apolloClient'
import { LOGIN } from '@/lib/mutations'
import { serialize } from 'cookie'
import { GET_CUSTOMER } from '@/lib/queries'

export const POST = async (request: NextRequest) => {
	const { email, password } = await request.json()

	const { data: loginResponseData, errors: loginResponseErrors } = await getClient().mutate({
		mutation: LOGIN,
		variables: { email, password },
	})

	const customerAccessToken = loginResponseData?.customerAccessTokenCreate?.customerAccessToken
	if (loginResponseErrors || !customerAccessToken) {
		const customerUserErrors = loginResponseData?.customerAccessTokenCreate?.customerUserErrors
		return NextResponse.json(loginResponseErrors || customerUserErrors)
	}

	const { accessToken, expiresAt } = customerAccessToken
	const { data: getCustomerResponseData, errors: getCustomersResponseErrors } =
		await getClient().query({
			query: GET_CUSTOMER,
			variables: { customerAccessToken: accessToken },
		})

	const customer = getCustomerResponseData?.customer
	if (getCustomersResponseErrors || !customer) {
		return NextResponse.json(getCustomersResponseErrors)
	}

	const expiryTime = new Date(expiresAt).getTime()
	const now = new Date().getTime()
	const cookie = serialize('customerAccessToken', accessToken, {
		httpOnly: true,
		secure: process.env.NODE_ENV !== 'development',
		maxAge: expiryTime - now,
		sameSite: 'strict',
		path: '/',
	})

	const { id, firstName } = customer
	const res = NextResponse.json({ id, firstName })
	res.headers.append('Set-Cookie', cookie)
	return res
}
