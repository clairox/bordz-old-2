import type { Product } from '@/types'
import { data } from '../products'

export const GET = async (request: Request, { params }: { params: { id: string } }) => {
	const product = data.find((product: Product) => product.id === +params.id)
	return Response.json(product)
}
