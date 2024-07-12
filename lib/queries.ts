import { gql } from '@/__generated__'

const GET_COLLECTION = gql(`
	query GetCollection(
		$handle: String!
		$limit: Int!
		$sortKey: ProductCollectionSortKeys!
		$filters: [ProductFilter!]
	) {
		collection(handle: $handle) {
			title
			products(first: $limit, sortKey: $sortKey, reverse: false, filters: $filters) {
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
`)

export { GET_COLLECTION }
