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

const ADDRESS_FIELDS = gql(`
	fragment AddressFields on MailingAddress {
		address1
		address2
		city
		formatted(withName: true)
		formattedArea
		id
		lastName
		name
		phone
		provinceCode
		zip
		firstName
		country
	}
`)

const GET_CUSTOMER = gql(`
	query GetCustomer(
		$customerAccessToken: String!
	) {
		customer(customerAccessToken: $customerAccessToken) {
			acceptsMarketing
			createdAt
			displayName
			email
			firstName
			id
			lastName
			numberOfOrders
			phone
			tags
			updatedAt
			addresses(first: 10) {
				nodes {
					...AddressFields
				}
			}
			defaultAddress {
				...AddressFields
			}
			orders(first: 10, sortKey: PROCESSED_AT) {
				totalCount
				nodes {
					cancelReason
					canceledAt
					currencyCode
					customerLocale
					customerUrl
					edited
					email
					financialStatus
					fulfillmentStatus
					id
					name
					orderNumber
					phone
					processedAt
					statusUrl
					billingAddress {
						...AddressFields
					}
					lineItems {
						nodes {
							currentQuantity
							quantity
							title
						}
					}
					originalTotalPrice {
						amount
						currencyCode
					}
					shippingAddress {
						...AddressFields
					}
					totalPriceV2 {
						amount
						currencyCode
					}
					totalShippingPriceV2 {
						amount
						currencyCode
					}
				}
			}
		}
	}
`)

export { GET_COLLECTION, GET_COLLECTION_MAX_PRICE, GET_CUSTOMER }
