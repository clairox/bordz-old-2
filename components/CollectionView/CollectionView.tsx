'use client'
import React, { Suspense, useState } from 'react'
import ProductListView from '@/components/ProductListView'
import CollectionSidebar from '@/components/CollectionSidebar'
import { useParams, usePathname, useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import _ from 'lodash'
import { ProductCollectionSortKeys } from '@/__generated__/graphql'
import { useCollection } from '@/hooks/useCollection'

const CollectionView: React.FunctionComponent = () => {
	const [openRefinements, setOpenRefinements] = useState<string[]>([])

	const pathname = usePathname()
	const router = useRouter()

	const params = useParams()
	const [collectionParam, subcollectionParam] = params.collection as string[]
	const searchParams = useSearchParams()
	const startParam = +(searchParams.get('start') || 0)

	const handle = collectionParam
	const limit = 40 + +(searchParams.get('start') || 0) || 40
	const sortKey = ProductCollectionSortKeys.Created
	const defaultFilters = subcollectionParam
		? [
				{ available: true },
				{
					productMetafield: {
						namespace: 'custom',
						key: 'subcategory',
						value: subcollectionParam,
					},
				},
		  ]
		: [{ available: true }]
	const filters = [
		...defaultFilters,
		...(searchParams
			.get('brand')
			?.split('|')
			.map(brand => ({ productVendor: brand })) || []),
		...(searchParams
			.get('size')
			?.split('|')
			.map(size => ({ variantOption: { name: 'size', value: size } })) || []),
		...(searchParams
			.get('color')
			?.split('|')
			.map(color => ({ productMetafield: { namespace: 'custom', key: 'color', value: color } })) ||
			[]),
	]

	const {
		collection,
		renderableProducts,
		productCount,
		availableFilters,
		subcollectionTitles,
		hasNextPage,
		error,
	} = useCollection(handle, limit, sortKey, filters)

	if (error) {
		console.error(error)
		return <></>
	}

	const title = params.subcollection
		? _.startCase((params.subcollection as string).replace('-', ' '))
		: collection?.title

	if (
		!title ||
		!renderableProducts ||
		productCount === undefined ||
		!availableFilters ||
		hasNextPage === undefined
	) {
		return <></>
	}

	let maxPrice = -Infinity
	renderableProducts?.forEach(product => {
		if (product.price > maxPrice) {
			maxPrice = product.price
		}
	})

	return (
		<div key={`${pathname}/${searchParams.toString()}`}>
			<div className="border-b border-black">
				<div>
					<div className="border-b border-black text-3xl">
						<h1>{title}</h1>
					</div>
				</div>
				<div className="flex flex-row justify-between mx-auto w-[50%]">
					{subcollectionParam === undefined &&
						subcollectionTitles?.map(title => (
							<Link href={pathname + '/' + title} key={title}>
								<span>{_.startCase(title.replace('-', ' '))}</span>
							</Link>
						))}
				</div>
			</div>
			<div className="grid grid-cols-5">
				<aside className="border-l border-black">
					<CollectionSidebar
						filters={availableFilters}
						maxPrice={maxPrice}
						openRefinements={openRefinements}
						setOpenRefinements={setOpenRefinements}
					/>
				</aside>
				<Suspense>
					<main className="col-span-4 border-l border-black">
						<ProductListView products={renderableProducts} />
						<div>
							<p>
								Showing {renderableProducts.length} of {productCount} products
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

// TODO: Use images from Zumiez collection page for featured images
// TODO: Make suspense fallbacks for CollectionView and its children
