'use client'
import React, { Suspense } from 'react'
import { useQueryRefHandlers, useReadQuery } from '@apollo/client'
import ProductListView from '@/components/ProductListView'
import CollectionSidebar from '@/components/CollectionSidebar'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { TransportedQueryRef } from '@apollo/experimental-nextjs-app-support'

const CollectionView: React.FunctionComponent<{ queryRef: TransportedQueryRef<unknown> }> = ({
	queryRef,
}) => {
	const { data, error } = useReadQuery(queryRef)

	const pathname = usePathname()
	const router = useRouter()

	const searchParams = useSearchParams()
	const startParam = +(searchParams.get('start') || 0)

	if (error) {
		console.log(error.message)
		return <></>
	}

	const collection = (data as any).collection
	const title = collection.title
	const hasNextPage = collection.products.pageInfo.hasNextPage
	const productCount = collection.products.filters.find(
		(filter: any) => filter.label === 'Availability'
	).values[0].count
	const brands = collection.products.filters
		.find((filter: any) => filter.label === 'Brand')
		.values.filter((value: any) => value.count > 0)
		.map((value: any) => value.label)
	const sizes = collection.products.filters
		.find((filter: any) => filter.label === 'Size')
		.values.filter((value: any) => value.count > 0)
		.map((value: any) => value.label)
	const colors =
		collection.products.filters
			.find((filter: any) => filter.label === 'Color')
			.values.filter((value: any) => value.count > 0)
			.map((value: any) => value.label) || []
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
					<CollectionSidebar brands={brands} sizes={sizes} colors={colors} />
				</aside>
				<Suspense key={searchParams.toString()}>
					<main className="col-span-4 border-l border-black">
						<ProductListView products={products} productCount={productCount} />
						<div>
							<p>
								Showing {products.length} of {productCount} products
							</p>
							{hasNextPage && (
								<button
									onClick={() => {
										const params = new URLSearchParams(searchParams.toString())
										params.set('start', (startParam + 40).toString())
										router.replace(pathname + '?' + params.toString(), { scroll: false })
									}}
								>
									Load More
								</button>
							)}
						</div>
					</main>
				</Suspense>
			</div>
		</div>
	)
}

export default CollectionView

// TODO: !! Subcategories header buttons
// TODO: Use images from Zumiez collection page for featured images
// TODO: Figure out solution to use.replace() use.refresh()
