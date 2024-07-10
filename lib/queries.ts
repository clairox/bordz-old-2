import { gql } from '@apollo/client'

const GET_COLLECTION = gql`
	query GetCollection(
		$handle: String
		$limit: Int
		$cursor: String
		$sortKey: ProductCollectionSortKeys
	) {
		collection(handle: $handle) {
			title
			products(
				first: $limit
				after: $cursor
				sortKey: $sortKey
				reverse: false
				filters: { available: true }
			) {
				nodes {
					id
					title
					handle
					description
					availableForSale
					priceRange {
						maxVariantPrice {
							amount
						}
					}
					featuredImage {
						src
						width
						height
					}
				}
				pageInfo {
					endCursor
					hasNextPage
				}
				filters {
					values {
						count
					}
				}
			}
		}
	}
`

export { GET_COLLECTION }
