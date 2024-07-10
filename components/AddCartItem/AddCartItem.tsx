'use client'
import React, { useState } from 'react'
import Counter from '@/components/Counter'
import Button from './Button'

const AddCartItem: React.FunctionComponent<{ productId: number; maxQuantity: number }> = ({
	productId,
	maxQuantity,
}) => {
	const minQuantity = 0
	const [quantity, setQuantity] = useState<number | ''>(1)

	const updateQuantity = (amount: number | '') => {
		return setQuantity(amount)
	}

	return (
		<div>
			<Counter
				value={quantity}
				setValue={updateQuantity}
				minValue={minQuantity}
				maxValue={maxQuantity}
			/>
			<Button id={productId} quantity={+quantity} />
		</div>
	)
}

export default AddCartItem
