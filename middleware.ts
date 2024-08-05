import { NextRequest, NextResponse } from 'next/server'

export const middleware = (request: NextRequest) => {
	const pathname = request.nextUrl.pathname
	if (pathname === '/account') {
		return NextResponse.rewrite(new URL('/account/settings', request.url))
	}
	if (pathname.startsWith('/api/customer')) {
		const customerAccessToken = request.cookies.get('customerAccessToken')
		if (!customerAccessToken) {
			return NextResponse.json(
				{ message: 'Missing customer access token', code: 'UNAUTHORIZED' },
				{ status: 401 }
			)
		}

		return NextResponse.next()
	}

	return NextResponse.next()
}
