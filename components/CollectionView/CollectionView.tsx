'use client'
import React from 'react'
import { gql, useSuspenseQuery } from '@apollo/client'
import ProductListView from '@/components/ProductListView'

const CollectionView: React.FunctionComponent<{ queryRef: any }> = ({ queryRef }) => {
	const { query, variables } = queryRef.options
	const { data, error, fetchMore } = useSuspenseQuery(gql(query), { variables })

	if (error) {
		console.log(error.message)
		return <></>
	}

	const collection = (data as any).collection
	const title = collection.title
	const cursor = collection.products.pageInfo.endCursor
	const productCount = collection.products.filters[0].values[0].count
	const products = collection.products.nodes.map((product: any) => {
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
					Showing {products.length} of {productCount} products
				</p>
				<button
					onClick={() =>
						fetchMore({
							variables: {
								cursor: cursor,
							},
						})
					}
				>
					Load More
				</button>
			</div>
		</div>
	)
}

export default CollectionView
