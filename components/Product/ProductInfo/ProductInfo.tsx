import { Money, Variant } from '@/types/store'
import React, { useState } from 'react'

const ProductInfo: React.FunctionComponent<{
	id: string
	title: string
	description: string
	variants: Variant[]
}> = ({ id, title, description, variants }) => {
	const [selectedVariant, setSelectedVariant] = useState(variants[0])

	const handleSelectVariant = (id: string) => {
		const variant = variants.find(variant => variant.id === id)
		if (variant !== undefined) {
			setSelectedVariant(variant)
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
			{/* <AddCartItem productId={product.id} maxQuantity={selectedVariant.quantityAvailable} /> */}
			<div>
				<p className="font-bold">Description:</p>
				<p>{description}</p>
			</div>
		</section>
	)
}

export default ProductInfo
