'use client'
import React from 'react'
import { useSuspenseQuery } from '@apollo/client'
import { GET_COLLECTION } from '@/lib/queries'
import ProductListView from '@/components/ProductListView'

const CollectionView: React.FunctionComponent = () => {
	const { data, error, fetchMore } = useSuspenseQuery(GET_COLLECTION, {
		variables: {
			handle: 'skateboard-decks',
			limit: 40,
			sortKey: 'CREATED',
			cursor: null,
		},
	})

	if (error) {
		console.log(error.message)
		return <></>
	}

	const collection = (data as any).collection
	const title = collection.title
	const cursor = collection.products.pageInfo.endCursor
	const productCount = collection.products.filters[0].values.reduce(
		(currentCount: number, value: any) => currentCount + value.count,
		0
	)
	const products = collection.products.edges.map((edge: any) => {
		const product = edge.node
		return {
			title: product.title,
			handle: product.handle,
			price: product.priceRange.maxVariantPrice.amount,
			featuredImage: {
				src: product.featuredImage.src,
				width: product.featuredImage.width,
				height: product.featuredImage.height,
			},
		}
	})

	return (
		<div>
			<div>
				<div className="border-b border-black text-3xl">
					<h1>{title}</h1>
				</div>
				<ProductListView products={products} productCount={productCount} />
			</div>
			<div>
				<p>
					Showing {} of {productCount} products
				</p>
				<button
					onClick={() =>
						fetchMore({
							variables: {
								cursor: cursor,
							},
						})
							.then(result => console.log(result.data))
							.catch(err => console.log(err))
					}
				>
					Load More
				</button>
			</div>
		</div>
	)
}

export default CollectionView
