import Counter from '@/components/UI/Counter'
import { useCartContext } from '@/context/CartContext'
import eventEmitter from '@/lib/utils/eventEmitter'
import { CartLineMerchandise, Money } from '@/types/store'
import { X } from '@phosphor-icons/react'
import Image from 'next/image'
import Link from 'next/link'
import React, { useState } from 'react'

const CartLineItem: React.FunctionComponent<{
	cost: {
		amountPerQuantity: Money
		compareAtAmountPerQuantity?: Money
		subtotalAmount: Money
		totalAmount: Money
	}
	lineId: string
	merchandise: CartLineMerchandise
	quantity: number
}> = ({ cost, lineId, merchandise, quantity }) => {
	const { updateCartLine, deleteCartLine } = useCartContext()
	const [updatedQuantity, setUpdatedQuantity] = useState(quantity)

	const quantityAvailable = merchandise.quantityAvailable > 99 ? 99 : merchandise.quantityAvailable

	const { title: productTitle, images, handle } = merchandise.product
	const featuredImage = images[0]

	const handleQuantityChange = async (newQuantity: number) => {
		const updatedCart = await updateCartLine(lineId, { quantity: newQuantity })
		if (updatedCart) {
			setUpdatedQuantity(newQuantity)
		}
	}
	const handleLinkClick = () => {
		eventEmitter.emit('linkClick')
	}

	const handleDelete = () => {
		deleteCartLine(lineId)
	}

	return (
		<article className="flex gap-4">
			<div className="cart-item-left w-[150px]">
				<Image
					src={featuredImage.src}
					alt={featuredImage.altText || 'product image'}
					width={featuredImage.width}
					height={featuredImage.height}
				/>
			</div>
			<div className="cart-item-right flex flex-col">
				<div className="flex justify-between">
					<Link onClick={handleLinkClick} className="hover:underline" href={`/products/${handle}`}>
						<h1 className="font-semibold">{productTitle}</h1>
					</Link>
					<button data-testid="deleteButton" onClick={handleDelete}>
						<X size={20} weight="regular" />
					</button>
				</div>
				<div className="flex justify-between">
					<p>{merchandise.title}</p>
					<Counter
						value={updatedQuantity}
						min={1}
						max={quantityAvailable}
						onChange={handleQuantityChange}
					/>
				</div>
				<div>
					<p>${cost.subtotalAmount.amount.toFixed(2)}</p>
				</div>
			</div>
		</article>
	)
}

export default CartLineItem
