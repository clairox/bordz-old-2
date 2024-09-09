import { NextRequest, NextResponse } from 'next/server'

export const middleware = (request: NextRequest) => {
    const pathname = request.nextUrl.pathname
    if (pathname === '/account') {
        return NextResponse.rewrite(new URL('/account/settings', request.url))
    }

    const allowedOrigins = [
        'http://localhost:3000',
        'https://bordz.vercel.app',
        'https://bordz-clairox-clairoxs-projects.vercel.app',
    ]

    const withCors = (response: NextResponse) => {
        const origin = request.headers.get('origin')
        if (origin && allowedOrigins.includes(origin)) {
            response.headers.append('Access-Control-Allow-Origin', origin)
        }
        response.headers.append('Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE, OPTIONS')
        response.headers.append(
            'Access-Control-Allow-Headers',
            'content-type, x-shopify-storefront-access-token, x-shopify-access-token',
        )
        return response
    }

    if (pathname.startsWith('/auth/check')) {
        const customerAccessToken = request.cookies.get('customerAccessToken')
        if (!customerAccessToken) {
            return withCors(new NextResponse(null, { status: 204 }))
        }
    }

    if (pathname.startsWith('/api/customer') || pathname.startsWith('/api/wishlist')) {
        const customerAccessToken = request.cookies.get('customerAccessToken')
        if (!customerAccessToken) {
            const response = withCors(
                NextResponse.json(
                    { message: 'Missing customer access token', code: 'UNAUTHORIZED' },
                    { status: request.method === 'OPTIONS' ? 200 : 401 },
                ),
            )

            return response
        }
    }

    return withCors(NextResponse.next())
}
