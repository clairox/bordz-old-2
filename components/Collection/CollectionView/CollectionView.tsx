'use client'
import React, { useState } from 'react'
import CollectionHeader from '../CollectionHeader'
import CollectionFooter from '../CollectionFooter'
import CollectionProductList from '../CollectionProductList'
import CollectionSidebar from '../CollectionSidebar'
import { useParams, usePathname, useSearchParams } from 'next/navigation'
import _ from 'lodash'
import { ProductCollectionSortKeys } from '@/__generated__/graphql'
import { useCollection } from '@/hooks/useCollection/useCollection'
import { useCollectionMaxPrice } from '@/hooks/useCollectionMaxPrice'

const CollectionView: React.FunctionComponent = () => {
	const [openRefinements, setOpenRefinements] = useState<string[]>([])

	const pathname = usePathname()

	const params = useParams()
	const [collectionParam, subcollectionParam] = params.collection as string[]
	const searchParams = useSearchParams()

	type SortByParamsType = {
		[key: string]: ProductCollectionSortKeys
	}

	const sortByParams: SortByParamsType = {
		recommended: ProductCollectionSortKeys.BestSelling,
		newest: ProductCollectionSortKeys.Created,
		priceLowToHigh: ProductCollectionSortKeys.Price,
		priceHighToLow: ProductCollectionSortKeys.Price,
	}

	const handle = collectionParam
	const limit = 40 + +(searchParams.get('start') || 0) || 40

	const sortByParam = (
		searchParams.get('sortBy') ? searchParams.get('sortBy') : 'recommended'
	) as keyof SortByParamsType
	const sortKey = sortByParams[sortByParam]
	const reverse = sortByParam === 'recommended' || sortByParam === 'priceHighToLow' ? true : false

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
	] as any

	const { maxPrice } = useCollectionMaxPrice(handle, limit, sortKey, filters)

	const filtersWithPrice = filters.concat(
		...(searchParams.get('priceMin') && searchParams.get('priceMax')
			? [{ price: { min: +searchParams.get('priceMin')!, max: +searchParams.get('priceMax')! } }]
			: [])
	)

	const {
		collection,
		renderableProducts,
		productCount,
		availableFilters,
		filteredPriceRange,
		subcollectionTitles,
		hasNextPage,
		error,
	} = useCollection(handle, limit, sortKey, filtersWithPrice, reverse)

	if (error) {
		console.error(error)
		return <></>
	}

	const title = subcollectionParam
		? _.startCase((subcollectionParam as string).replace('-', ' '))
		: collection?.title

	if (
		!title ||
		!renderableProducts ||
		productCount === undefined ||
		!availableFilters ||
		filteredPriceRange === undefined ||
		maxPrice === undefined ||
		hasNextPage === undefined
	) {
		return <></>
	}

	return (
		<div key={`${pathname}/${searchParams.toString()}`}>
			<CollectionHeader title={title} subcollectionTitles={subcollectionTitles} />
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
					<CollectionProductList products={renderableProducts} />
					<CollectionFooter
						products={renderableProducts}
						productCount={productCount}
						hasNextPage={hasNextPage}
					/>
				</main>
			</div>
		</div>
	)
}

export default CollectionView

// TODO: Use images from Zumiez collection page for featured images
// TODO: Make suspense fallbacks for CollectionView and its children
