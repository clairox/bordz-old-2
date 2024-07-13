import { query } from '@/lib/apollo/apolloClient'
import type { CollectionName } from '@/types'
import React from 'react'
import { GET_COLLECTION } from '@/lib/queries'
import CollectionView from '@/components/CollectionView'
import { ProductCollectionSortKeys } from '@/__generated__/graphql'
import _ from 'lodash'

const Page: React.FunctionComponent<{
	params: { collection: CollectionName; subcollection: string }
	searchParams: { start?: number; brand?: string; size?: string; color?: string }
}> = async ({ params, searchParams }) => {
	const handle = params.collection
	const limit = 40 + +(searchParams.start || 0) || 40
	const sortKey = ProductCollectionSortKeys.Created
	const defaultFilters = [
		{ available: true },
		{
			productMetafield: { namespace: 'custom', key: 'subcategory', value: params.subcollection },
		},
	]
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
	]

	const { data, error, loading } = await query({
		query: GET_COLLECTION,
		variables: {
			handle,
			limit,
			sortKey,
			filters,
		},
		fetchPolicy: 'cache-first',
	})

	const title = _.startCase(params.subcollection.replace('-', ' '))
	return <CollectionView collection={data.collection} title={title} isSubcollection={true} />
}

export default Page
