'use client'
import React from 'react'
import { CartLine } from '@/types/store'
import { useCartContext } from '@/context/CartContext'

const CartBase: React.FunctionComponent<{
	children: (lineItems: CartLine[], subtotal: number) => React.ReactNode
}> = ({ children }) => {
	const { cart } = useCartContext()

	if (cart && cart.totalQuantity > 0) {
		return <div>{children(cart.lines, cart.cost.subtotalAmount.amount)}</div>
	}

	return <>Your cart is empty</>
}

export default CartBase
