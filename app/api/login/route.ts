import { NextRequest, NextResponse } from 'next/server'
import { serialize } from 'cookie'
import { handleErrorResponse } from '@/lib/utils/api'
import { createAccessToken } from './common/requestHandlers'

export const POST = async (request: NextRequest) => {
	const { email, password } = await request.json()

	try {
		const customerAccessToken = await createAccessToken(email, password)
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
		return response
	} catch (error) {
		return handleErrorResponse(error as Error)
	}
}
