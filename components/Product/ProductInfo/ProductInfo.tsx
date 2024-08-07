'use client'
import { Button } from '@/components/UI/Button'
import Counter from '@/components/UI/Counter'
import { Variant } from '@/types/store'
import React, { useEffect, useState } from 'react'
import { useCartContext } from '@/context/CartContext'
import { HeartStraight } from '@phosphor-icons/react'
import { addWishlistItem, getLocalWishlist, removeWishlistItem } from '@/lib/utils/wishlist'

const ProductInfo: React.FunctionComponent<{
	id: string
	title: string
	description: string
	variants: Variant[]
}> = ({ id, title, description, variants }) => {
	const [selectedVariant, setSelectedVariant] = useState(variants[0])
	const [quantity, setQuantity] = useState(1)

	const [isInWishlist, setIsInWishlist] = useState(false)

	useEffect(() => {
		const wishlist = getLocalWishlist()
		setIsInWishlist(wishlist.includes(selectedVariant.id))
	}, [selectedVariant])

	const { addCartLine } = useCartContext()

	const handleSelectVariant = (id: string) => {
		const variant = variants.find(variant => variant.id === id)
		if (variant !== undefined) {
			setSelectedVariant(variant)
		}
	}

	const handleAddToCart = async () => {
		const updatedCart = await addCartLine(
			selectedVariant.id,
			Math.min(quantity, selectedVariant.quantityAvailable)
		)
		if (updatedCart) {
			console.log('Line added!')
		}
	}

	const handleWishlistToggle = async () => {
		const item = selectedVariant.id
		if (isInWishlist) {
			const itemRemoved = await removeWishlistItem(item)
			setIsInWishlist(!itemRemoved)
		} else {
			const itemAdded = await addWishlistItem(item)
			setIsInWishlist(itemAdded)
		}
	}

	return (
		<section>
			<div>
				<h1 className="text-2xl font-semibold">{title}</h1>
			</div>
			<div>
				<span className="text-xl font-semibold">${selectedVariant.price.amount}</span>
			</div>
			<div className="variants my-6">
				{variants.map(variant => {
					return (
						<span
							className={`p-2 border border-black ${
								variant.id === selectedVariant.id
									? 'bg-black text-white cursor-default'
									: 'cursor-pointer hover:bg-gray-100'
							}`}
							key={variant.id}
							onClick={() => handleSelectVariant(variant.id)}
						>
							{variant.title}
						</span>
					)
				})}
			</div>
			<Counter
				value={quantity}
				min={1}
				max={99}
				onChange={newQuantity => setQuantity(newQuantity)}
			/>
			<div className="flex">
				<Button onClick={handleAddToCart}>Add To Bag</Button>
				<Button onClick={handleWishlistToggle}>
					{isInWishlist ? (
						<HeartStraight size={28} weight={'fill'} />
					) : (
						<HeartStraight size={28} weight={'regular'} />
					)}
				</Button>
			</div>
			<div>
				<p className="font-bold">Description:</p>
				<p>{description}</p>
			</div>
		</section>
	)
}

export default ProductInfo
