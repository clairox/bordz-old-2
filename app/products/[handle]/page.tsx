import type { Product } from '@/types'
import React from 'react'
import ProductGallery from '@/components/ProductGallery/ProductGallery'
import AddCartItem from '@/components/AddCartItem/AddCartItem'
import { createStorefrontApiClient } from '@shopify/storefront-api-client'

const client = createStorefrontApiClient({
	storeDomain: 'https://quickstart-75684a38.myshopify.com/',
	apiVersion: '2024-04',
	publicAccessToken: process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN,
})

type ProductDetails = {
	id: number
	title: string
	description: string
	brand: string
	price: number
	images: {
		src: string
		width: number
		height: number
	}[]
	color: string
	size: string
	maxQuantity: number
}

const getProduct = async (handle: string) => {
	const productQuery = `
	query ProductQuery($handle: String!) {
		productByHandle(handle: $handle) {
			id
			title
			description
			vendor
			variants(first: 10) {
				nodes {
					id
					quantityAvailable
					price {
						amount
					}
					selectedOptions {
						name
						value
					}
					product {
						images(first: 10) {
							nodes {
								src
								width
								height
							}
						}
					}
				}
			}
		}
	}
	`
	const { data, errors, extensions } = await client.request(productQuery, {
		variables: { handle: handle },
	})

	const product = data.productByHandle

	return {
		id: 1,
		title: product.title,
		description: product.description,
		brand: product.vendor,
		price: +product.variants.nodes[0].price.amount,
		images: product.variants.nodes[0].product.images.nodes.map((node: any) => ({
			src: node.src,
			width: node.width,
			height: node.height,
		})),
		size: product.variants.nodes[0].selectedOptions.find((option: any) => option.name === 'Size')!
			.value,
		maxQuantity: product.variants.nodes[0].quantityAvailable,
	}
}

const Page: React.FunctionComponent<{ params: { handle: string } }> = async ({ params }) => {
	const product = (await getProduct(params.handle)) as ProductDetails

	if (product) {
		console.log(product)
		return (
			<div className="flex">
				<ProductGallery images={product.images} />
				<ProductInfo product={product} />
			</div>
		)
	}
}

const ProductInfo: React.FunctionComponent<{
	product: ProductDetails
}> = ({ product }) => {
	return (
		<section>
			<div>
				<h1>{product.title}</h1>
			</div>
			<div>
				<span>${product.price}</span>
			</div>
			<p className="font-bold">
				Color: <span className="font-normal">{'Assorted'}</span>
			</p>
			<p className="font-bold">
				Size: <span className="font-normal">{product.size}</span>
			</p>
			<AddCartItem productId={product.id} maxQuantity={product.maxQuantity} />
			<div>
				<p className="font-bold">Description:</p>
				<p>{product.description}</p>
			</div>
			{/* <div>
				<p className="font-bold">Product Details:</p>
				<ul>
					{details.map((detail, idx) => (
						<li key={idx}>{detail}</li>
					))}
				</ul>
			</div> */}
		</section>
	)
}

export default Page
