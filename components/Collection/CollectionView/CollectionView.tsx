'use client'
import React, { useState } from 'react'
import { useParams, usePathname, useRouter, useSearchParams } from 'next/navigation'
import CollectionHeader from '../CollectionHeader'
import CollectionFooter from '../CollectionFooter'
import CollectionProductList from '../CollectionProductList'
import CollectionSidebar from '../CollectionSidebar'
import { useCollection } from '@/hooks/useCollection'
import { useCollectionMaxPrice } from '@/hooks/useCollectionMaxPrice'
import { getFilters, getSortKey, MAX_PRODUCTS_PER_LOAD } from '@/lib/collectionUtils'
import _ from 'lodash'

const CollectionView: React.FunctionComponent = () => {
	const router = useRouter()
	const pathname = usePathname()
	const params = useParams()
	const searchParams = useSearchParams()

	const [openRefinements, setOpenRefinements] = useState<string[]>([])

	const [collectionParam, subcollectionParam] = params.collection as string[]

	const handle = collectionParam
	const limit = MAX_PRODUCTS_PER_LOAD + _.toInteger(searchParams.get('start'))
	const { sortKey, reverse } = getSortKey(searchParams.get('sortBy'))
	const filters = getFilters(searchParams, subcollectionParam)

	let filtersWithPriceRange = filters
	const priceMinSearchParam = searchParams.get('priceMin')
	const priceMaxSearchParam = searchParams.get('priceMax')
	const hasValidPriceSearchParams = priceMinSearchParam !== null && priceMaxSearchParam !== null

	if (hasValidPriceSearchParams) {
		filtersWithPriceRange = filtersWithPriceRange.concat([
			{ price: { min: +priceMinSearchParam, max: +priceMaxSearchParam } },
		])
	}

	const { maxPrice } = useCollectionMaxPrice(handle, limit, filters)
	const {
		collection,
		products,
		productCount,
		availableFilters,
		filteredPriceRange,
		subcollectionNames,
		hasNextPage,
		error,
	} = useCollection(handle, limit, sortKey, filtersWithPriceRange, reverse)

	if (error) {
		// TODO: Do error stuff here
		return <></>
	}

	const title = subcollectionParam
		? _.startCase((subcollectionParam as string).replace('-', ' '))
		: collection?.title

	if (
		!title ||
		!products ||
		productCount === undefined ||
		!availableFilters ||
		filteredPriceRange === undefined ||
		maxPrice === undefined ||
		hasNextPage === undefined
	) {
		return <></>
	}

	const subcollectionNamesOrUndefined = subcollectionParam ? undefined : subcollectionNames

	return (
		<div key={`${pathname}/${searchParams.toString()}`}>
			<CollectionHeader
				title={title}
				subcollectionNames={subcollectionNamesOrUndefined}
				basePath={pathname}
			/>
			<div className="grid grid-cols-5">
				<aside className="border-l border-black">
					<CollectionSidebar
						filters={availableFilters}
						maxPrice={maxPrice}
						openRefinements={openRefinements}
						setOpenRefinements={setOpenRefinements}
					/>
				</aside>
				<main className="col-span-4 border-l border-black">
					<CollectionProductList products={products} />
					<CollectionFooter
						renderedProductCount={products.length}
						totalProductCount={productCount}
						hasNextPage={hasNextPage}
						basePath={pathname}
						router={router}
						searchParams={searchParams}
					/>
				</main>
			</div>
		</div>
	)
}

export default CollectionView

// TODO: Use images from Zumiez collection page for featured images
// TODO: Make suspense fallbacks for CollectionView and its children
