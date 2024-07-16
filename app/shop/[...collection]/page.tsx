import { PreloadQuery } from '@/lib/apollo/apolloClient'
import React from 'react'
import { GET_COLLECTION } from '@/lib/queries'
import CollectionView from '@/components/Collection/CollectionView'
import { ProductCollectionSortKeys } from '@/__generated__/graphql'
import _ from 'lodash'

const CollectionPage: React.FunctionComponent<{
	params: { collection: string[] }
	searchParams: { [key: string]: string }
}> = async ({ params, searchParams }) => {
	const [collectionParam, subcollectionParam] = params.collection

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
	const limit = 40 + +(searchParams.start || 0) || 40

	const sortByParam = (
		searchParams.sortBy ? searchParams.sortBy : 'recommended'
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
		...(searchParams.brand?.split('|').map(brand => ({ productVendor: brand })) || []),
		...(searchParams.size
			?.split('|')
			.map(size => ({ variantOption: { name: 'size', value: size } })) || []),
		...(searchParams.color
			?.split('|')
			.map(color => ({ productMetafield: { namespace: 'custom', key: 'color', value: color } })) ||
			[]),
		...(searchParams.priceMin && searchParams.priceMax
			? [{ price: { min: +searchParams.priceMin, max: +searchParams.priceMax } }]
			: []),
	]

	return (
		<PreloadQuery query={GET_COLLECTION} variables={{ handle, limit, sortKey, filters, reverse }}>
			<CollectionView />
		</PreloadQuery>
	)
}

export default CollectionPage
