import type { NextRequest } from 'next/server'
import { data } from './products'

export const GET = async (request: NextRequest) => {
	const handle = request.nextUrl.searchParams.get('handle')
	return Response.json(data.find(product => product.handle === handle))
}
