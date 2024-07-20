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
		$filters: [ProductFilter!]
	) {
		collection(handle: $handle) {
			products(first: $limit, filters: $filters) {
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

const GET_CUSTOMER = gql(`
	query GetCustomer(
		$customerAccessToken: String!
	) {
		customer(customerAccessToken: $customerAccessToken) {
			id
			email
			firstName
			lastName
			displayName
		}
	}
`)

export { GET_COLLECTION, GET_COLLECTION_MAX_PRICE, GET_CUSTOMER }
