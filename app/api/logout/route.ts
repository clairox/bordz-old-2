import { serialize } from 'cookie'
import { NextResponse } from 'next/server'

export const POST = async () => {
	const cookie = serialize('customerAccessToken', '', {
		httpOnly: true,
		secure: process.env.NODE_ENV !== 'development',
		maxAge: -1,
		sameSite: 'strict',
		path: '/',
	})

	const res = NextResponse.json({ success: true })
	res.headers.append('Set-Cookie', cookie)
	return res
}
