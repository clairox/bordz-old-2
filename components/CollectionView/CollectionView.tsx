'use client'
import React, { Suspense } from 'react'
import ProductListView from '@/components/ProductListView'
import CollectionSidebar from '@/components/CollectionSidebar'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import type { ProductListItem } from '@/types'
import { GetCollectionQuery } from '@/__generated__/graphql'

const CollectionView: React.FunctionComponent<{
	collection: GetCollectionQuery['collection']
}> = ({ collection }) => {
	const pathname = usePathname()
	const router = useRouter()

	const searchParams = useSearchParams()
	const startParam = +(searchParams.get('start') || 0)

	const title = collection?.title
	const products = collection?.products?.nodes.map(
		product =>
			({
				title: product.title,
				handle: product.handle,
				price: product.priceRange.maxVariantPrice.amount,
				featuredImage: {
					src: product.featuredImage?.src,
					width: product.featuredImage?.width,
					height: product.featuredImage?.height,
				},
			} as ProductListItem)
	)
	const productCount = collection?.products?.filters
		?.find(filter => filter.label === 'Availability')
		?.values.find(value => value.label === 'In stock')?.count
	const availableFilters = collection?.products.filters
		.filter(filter => {
			const productFilterLabels = ['Brand', 'Size', 'Color']
			return productFilterLabels.includes(filter.label)
		})
		.map(filter => ({
			label: filter.label.toLowerCase(),
			values: filter.values.filter(value => value.count > 0).map(value => value.label),
		}))
	const hasNextPage = collection?.products.pageInfo.hasNextPage

	if (
		!title ||
		!products ||
		productCount === undefined ||
		!availableFilters ||
		hasNextPage === undefined
	) {
		return <></>
	}

	return (
		<div key={`${pathname}/${searchParams.toString()}`}>
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
					<CollectionSidebar filters={availableFilters} />
				</aside>
				<Suspense>
					<main className="col-span-4 border-l border-black">
						<ProductListView products={products} />
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
