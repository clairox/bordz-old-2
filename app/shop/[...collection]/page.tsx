import React from 'react'
import CollectionView from '@/components/Collection/CollectionView'
import { PreloadQuery } from '@/lib/apollo/apolloClient'
import { GET_COLLECTION } from '@/lib/queries'
import { getFiltersServer, getSortKey, MAX_PRODUCTS_PER_LOAD } from '@/lib/collectionUtils'
import _ from 'lodash'

const CollectionPage: React.FunctionComponent<{
	params: { collection: string[] }
	searchParams: { [key: string]: string }
}> = async ({ params, searchParams }) => {
	const [collectionParam, subcollectionParam] = params.collection

	const handle = collectionParam
	const limit = MAX_PRODUCTS_PER_LOAD + _.toInteger(searchParams['start'])
	const { sortKey, reverse } = getSortKey(searchParams['sortBy'])
	const filters = getFiltersServer(searchParams, subcollectionParam)

	return (
		<PreloadQuery query={GET_COLLECTION} variables={{ handle, limit, sortKey, filters, reverse }}>
			<CollectionView />
		</PreloadQuery>
	)
}

export default CollectionPage
