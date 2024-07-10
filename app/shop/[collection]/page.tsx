import { PreloadQuery } from '@/lib/apollo/apolloClient'
import type { CollectionName } from '@/types'
import React from 'react'
import { GET_COLLECTION } from '@/lib/queries'
import CollectionView from '@/components/CollectionView'

const Page: React.FunctionComponent<{
	params: { collection: CollectionName }
	searchParams: { start: number }
}> = async ({ params, searchParams }) => {
	const handle = params.collection
	const limit = 40 + +searchParams.start || 40
	const sortKey = 'CREATED'

	return (
		<PreloadQuery
			query={GET_COLLECTION}
			variables={{
				handle,
				limit,
				sortKey,
				cursor: null,
			}}
		>
			{queryRef => <CollectionView queryRef={queryRef} />}
		</PreloadQuery>
	)
}

export default Page
