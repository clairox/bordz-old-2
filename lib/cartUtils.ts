import type { UnsavedCartItem, Product, CartItem } from '@/types'

function makeCartItem(product: Product, quantity: number): UnsavedCartItem {
	return {
		pid: product.id,
		linePrice: product.salePrice * quantity,
		quantity: quantity,
	}
}

function makeFullCartItem(
	id: number,
	product: Product,
	quantity: number,
	cartId: string
): CartItem {
	return {
		id,
		pid: product.id,
		linePrice: product.salePrice * quantity,
		quantity: quantity,
		createdAt: new Date(Date.now() + id),
		cartId,
	}
}

export { makeCartItem, makeFullCartItem }
