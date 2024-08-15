'use client'
import React, { useState } from 'react'
import { useParams, usePathname, useRouter, useSearchParams } from 'next/navigation'
import CollectionHeader from '../CollectionHeader'
import CollectionFooter from '../CollectionFooter'
import CollectionProductList from '../CollectionProductList'
import CollectionSidebar from '../CollectionSidebar'
import { useCollection } from '@/hooks/useCollection'
import { useCollectionMaxPrice } from '@/hooks/useCollectionMaxPrice'
import {
	getFilters,
	getSortKey,
	isValidPriceRange,
	MAX_PRODUCTS_PER_LOAD,
	processPriceParams,
} from '@/lib/utils/collection'
import _ from 'lodash'
import { ProductListItem } from '@/types/store'

const CollectionView: React.FunctionComponent<{
	products: ProductListItem[]
	maxPrice: number
	hasNextPage: boolean
	productCount: number
}> = ({ products, maxPrice, hasNextPage, productCount }) => {
	const [openRefinements, setOpenRefinements] = useState<string[]>([])

	const router = useRouter()
	const pathname = usePathname()
	const params = useParams()
	const searchParams = useSearchParams()

	return (
		<div>
			{/* <CollectionHeader title={title} subcategories={subcategories} pathname={pathname} /> */}
			<div className="grid grid-cols-5">
				<aside className="border-l border-black">
					<CollectionSidebar
						maxPrice={maxPrice}
						openRefinements={openRefinements}
						setOpenRefinements={setOpenRefinements}
					/>
				</aside>
				<main className="col-span-4 border-l border-black">
					<CollectionProductList products={products} />
					<CollectionFooter
						productCount={products.length}
						totalProductCount={productCount}
						hasNextPage={hasNextPage}
						pathname={pathname}
						router={router}
						searchParams={searchParams}
					/>
				</main>
			</div>
		</div>
	)

	// const [openRefinements, setOpenRefinements] = useState<string[]>([])

	// const [collectionParam, subcollectionParam] = params.collection as string[]

	// const handle = collectionParam
	// const limit = MAX_PRODUCTS_PER_LOAD + _.toInteger(searchParams.get('start'))
	// const { sortKey, reverse } = getSortKey(searchParams.get('sortBy'))
	// const filters = getFilters(searchParams, subcollectionParam)

	// const { maxPrice } = useCollectionMaxPrice(handle, limit, filters)

	// let filtersWithPriceRange = filters
	// const priceMinParam = searchParams.get('priceMin')
	// const priceMaxParam = searchParams.get('priceMax')

	// const selectedPriceFilter = processPriceParams(priceMinParam, priceMaxParam)
	// if (isValidPriceRange(selectedPriceFilter)) {
	// 	const [minPriceFilter, maxPriceFilter] = selectedPriceFilter
	// 	filtersWithPriceRange = filters.concat([
	// 		{ price: { min: minPriceFilter, max: maxPriceFilter } },
	// 	])
	// }

	// const {
	// 	collection,
	// 	products,
	// 	productCount,
	// 	availableFilters,
	// 	filteredPriceRange,
	// 	subcollectionNames,
	// 	hasNextPage,
	// 	error,
	// } = useCollection(handle, limit, sortKey, filtersWithPriceRange, reverse)

	// if (error) {
	// 	return <></>
	// }

	// const title = subcollectionParam
	// 	? _.startCase((subcollectionParam as string).replace('-', ' '))
	// 	: collection?.title

	// if (
	// 	!title ||
	// 	!products ||
	// 	productCount === undefined ||
	// 	!availableFilters ||
	// 	filteredPriceRange === undefined ||
	// 	maxPrice === undefined ||
	// 	hasNextPage === undefined
	// ) {
	// 	return <></>
	// }

	// const subcollectionNamesOrUndefined = subcollectionParam ? undefined : subcollectionNames

	// return (
	// 	<div key={`${pathname}/${searchParams.toString()}`}>
	// 		<CollectionHeader
	// 			title={title}
	// 			subcollectionNames={subcollectionNamesOrUndefined}
	// 			basePath={pathname}
	// 		/>
	// 		<div className="grid grid-cols-5">
	// 			<aside className="border-l border-black">
	// 				<CollectionSidebar
	// 					availableFilters={availableFilters}
	// 					maxPrice={maxPrice}
	// 					openRefinements={openRefinements}
	// 					setOpenRefinements={setOpenRefinements}
	// 					basePath={pathname}
	// 					router={router}
	// 					searchParams={searchParams}
	// 				/>
	// 			</aside>
	// 			<main className="col-span-4 border-l border-black">
	// 				<CollectionProductList products={products} />
	// 				<CollectionFooter
	// 					renderedProductCount={products.length}
	// 					totalProductCount={productCount}
	// 					hasNextPage={hasNextPage}
	// 					basePath={pathname}
	// 					router={router}
	// 					searchParams={searchParams}
	// 				/>
	// 			</main>
	// 		</div>
	// 	</div>
	// )
}

export default CollectionView
