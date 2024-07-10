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
			<div className="border-b border-black">
				<div>
					<div className="border-b border-black text-3xl">
						<h1>{title}</h1>
					</div>
				</div>
				<div className="flex flex-row justify-between mx-auto w-[50%]">
					<div>Category 1</div>
					<div>Category 2</div>
					<div>Category 3</div>
				</div>
			</div>
			<div className="grid grid-cols-5">
				<aside className="border-l border-black">
					<section>
						<div className="header border-b border-black">
							<button className="w-full h-full px-6 py-4 text-left">
								<span>Sort</span>
							</button>
						</div>
						<div className="content">
							<ul></ul>
						</div>
					</section>
					<section>
						<div className="header border-b border-black">
							<button className="w-full h-full px-6 py-4 text-left">
								<span>Brand</span>
							</button>
						</div>
						<div className="content">
							<ul></ul>
						</div>
					</section>
					<section>
						<div className="header border-b border-black">
							<button className="w-full h-full px-6 py-4 text-left">
								<span>Size</span>
							</button>
						</div>
						<div className="content">
							<ul></ul>
						</div>
					</section>
					<section>
						<div className="header border-b border-black">
							<button className="w-full h-full px-6 py-4 text-left">
								<span>Color</span>
							</button>
						</div>
						<div className="content">
							<ul></ul>
						</div>
					</section>
					<section>
						<div className="header border-b border-black">
							<button className="w-full h-full px-6 py-4 text-left">
								<span>Price</span>
							</button>
						</div>
						<div className="content">
							<ul></ul>
						</div>
					</section>
				</aside>
				<main className="col-span-4 border-l border-black">
					<ProductListView products={products} productCount={productCount} />
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
				</main>
			</div>
		</div>
	)
}

export default CollectionView
