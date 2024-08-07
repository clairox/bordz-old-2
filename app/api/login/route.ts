import { NextRequest, NextResponse } from 'next/server'
import { serialize } from 'cookie'
import { APIError, DEFAULT_ERROR_RESPONSE } from '@/lib/utils/api'
import { login } from './utils'

export const POST = async (request: NextRequest) => {
	const { email, password } = await request.json()

	try {
		const customerAccessToken = await login(email, password)

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
	} catch (error) {
		if (error instanceof APIError) {
			const { message, code, status } = error
			return NextResponse.json({ message, code }, { status })
		} else {
			return DEFAULT_ERROR_RESPONSE
		}
	}
}
