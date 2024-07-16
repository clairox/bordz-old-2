import { gql } from '@/__generated__'

const GET_COLLECTION = gql(`
	query GetCollection(
		$handle: String!
		$limit: Int!
		$sortKey: ProductCollectionSortKeys!
		$filters: [ProductFilter!]
		$reverse: Boolean = false
	) {
		collection(handle: $handle) {
			title
			products(first: $limit, sortKey: $sortKey, reverse: $reverse, filters: $filters) {
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
						input
						count
					}
				}
			}
		}
	}
`)

const GET_COLLECTION_MAX_PRICE = gql(`
	query GetCollectionMaxPrice(
		$handle: String!
		$limit: Int!
		$sortKey: ProductCollectionSortKeys!
		$filters: [ProductFilter!]
	) {
		collection(handle: $handle) {
			products(first: $limit, sortKey: $sortKey, reverse: false, filters: $filters) {
				nodes {
					priceRange {
						maxVariantPrice {
							amount
						}
					}
				}
			}
		}
	}
`)

export { GET_COLLECTION, GET_COLLECTION_MAX_PRICE }

// TODO: !! Remove sortKey and reverse from GET_COLLECTION_MAX_PRICE
