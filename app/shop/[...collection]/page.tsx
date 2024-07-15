import { PreloadQuery } from '@/lib/apollo/apolloClient'
import React from 'react'
import { GET_COLLECTION } from '@/lib/queries'
import CollectionView from '@/components/CollectionView'
import { ProductCollectionSortKeys } from '@/__generated__/graphql'
import _ from 'lodash'

const CollectionPage: React.FunctionComponent<{
	params: { collection: string[] }
	searchParams: { [key: string]: string }
}> = async ({ params, searchParams }) => {
	const [collectionParam, subcollectionParam] = params.collection

	const handle = collectionParam
	const limit = 40 + +(searchParams.start || 0) || 40
	const sortKey = ProductCollectionSortKeys.Created
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
	]

	return (
		<PreloadQuery query={GET_COLLECTION} variables={{ handle, limit, sortKey, filters }}>
			<CollectionView />
		</PreloadQuery>
	)
}

export default CollectionPage
