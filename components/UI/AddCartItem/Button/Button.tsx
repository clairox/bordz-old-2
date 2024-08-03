'use client'
import { useCartContext } from '@/context/CartContext/CartContext'
import React from 'react'

const Button: React.FunctionComponent<{ id: number; quantity?: number }> = ({
	id,
	quantity = 1,
}) => {
	const { addItem } = useCartContext()

	const handleClick = () => {
		addItem(id, quantity)
	}

	return (
		<button disabled={quantity === 0 || addItem === undefined} onClick={handleClick}>
			Add to Bag
		</button>
	)
}

export default Button
