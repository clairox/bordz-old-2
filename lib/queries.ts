import { gql } from '@apollo/client'

const GET_COLLECTION = gql`
	query GetCollection(
		$handle: String!
		$limit: Int!
		$sortKey: ProductCollectionSortKeys!
		$filters: [ProductFilter!]
		$cursor: String
	) {
		collection(handle: $handle) {
			title
			products(
				first: $limit
				after: $cursor
				sortKey: $sortKey
				reverse: false
				filters: $filters
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
					label
					values {
						label
						count
					}
				}
			}
		}
	}
`

export { GET_COLLECTION }
