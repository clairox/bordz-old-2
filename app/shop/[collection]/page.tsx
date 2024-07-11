import { PreloadQuery } from '@/lib/apollo/apolloClient'
import type { CollectionName } from '@/types'
import React from 'react'
import { GET_COLLECTION } from '@/lib/queries'
import CollectionView from '@/components/CollectionView'

const Page: React.FunctionComponent<{
	params: { collection: CollectionName }
	searchParams: { start?: number; brand?: string; size?: string }
}> = async ({ params, searchParams }) => {
	console.log('d')
	const handle = params.collection
	const limit = 40 + +(searchParams.start || 0) || 40
	const sortKey = 'CREATED'
	const defaultFilters = [{ available: true }]
	const filters = [
		...defaultFilters,
		...(searchParams.brand?.split('|').map(brand => ({ productVendor: brand })) || []),
		...(searchParams.size
			?.split('|')
			.map(size => ({ variantOption: { name: 'size', value: size } })) || []),
	]

	return (
		<PreloadQuery
			query={GET_COLLECTION}
			variables={{
				handle,
				limit,
				sortKey,
				filters,
				cursor: null,
			}}
		>
			{queryRef => <CollectionView queryRef={queryRef} />}
		</PreloadQuery>
	)
}

export default Page
