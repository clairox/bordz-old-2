import { PreloadQuery } from '@/lib/apollo/apolloClient'
import type { CollectionName } from '@/types'
import React, { Suspense } from 'react'
import { GET_COLLECTION } from '@/lib/queries'
import CollectionView from '@/components/CollectionView/CollectionView'

const Page: React.FunctionComponent<{
	params: { collection: CollectionName }
	searchParams: { start: number }
}> = async ({ params, searchParams }) => {
	const limit = 40 + +searchParams.start || 40
	const sortKey = 'CREATED'

	return (
		<PreloadQuery
			query={GET_COLLECTION}
			variables={{
				handle: 'skateboard-decks',
				limit: 40,
				sortKey: 'CREATED',
				cursor: null,
			}}
		>
			<CollectionView />
		</PreloadQuery>
	)
}

export default Page
