import { getClient, query } from '@/lib/apollo/apolloClient'
import type { CollectionName } from '@/types'
import React, { use } from 'react'
import { GET_COLLECTION } from '@/lib/queries'
import CollectionView from '@/components/CollectionView'
import { ProductCollectionSortKeys } from '@/__generated__/graphql'

const Page: React.FunctionComponent<{
	params: { collection: CollectionName }
	searchParams: { start?: number; brand?: string; size?: string; color?: string }
}> = async ({ params, searchParams }) => {
	const handle = params.collection
	const limit = 40 + +(searchParams.start || 0) || 40
	const sortKey = ProductCollectionSortKeys.Created
	const defaultFilters = [{ available: true }]
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
		fetchPolicy: 'no-cache',
	})

	return <CollectionView collection={data.collection} />
}

export default Page
