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
			products(first: $limit, after: $cursor, sortKey: $sortKey, reverse: false) {
				edges {
					node {
						id
						title
						handle
						description
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
					cursor
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
