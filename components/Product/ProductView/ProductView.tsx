'use client'
import { useParams } from 'next/navigation'
import React from 'react'
import ProductGallery from '@/components/Product/ProductGallery'
import ProductInfo from '@/components/Product/ProductInfo'
import { useProduct } from '@/hooks/useProduct'

const ProductView = () => {
	const params = useParams()
	const handle = params.handle as string

	const { product, error } = useProduct(handle)

	if (error) {
		return <></>
	}

	if (!product) {
		return <></>
	}

	return (
		<div className="flex">
			<ProductGallery images={product.images} />
			<ProductInfo
				id={product.id}
				title={product.title}
				variants={product.variants}
				description={product.description}
			/>
		</div>
	)
}

export default ProductView
