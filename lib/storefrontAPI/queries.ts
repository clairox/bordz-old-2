import { gql } from '@/__generated__/storefront'

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

const GET_PRODUCT = gql(`
	query GetProduct($handle: String!) {
		product(handle: $handle) {
			description
			handle
			id
			productType
			tags
			title
			vendor
			images {
				nodes {
					altText
					height
					id
					src
					width
				}
			}
			variants {
				nodes {
					availableForSale
					id
					quantityAvailable
					title
					compareAtPriceV2 {
						amount
						currencyCode
					}
					priceV2 {
						amount
						currencyCode
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

const GET_CUSTOMER_ID_ONLY = gql(`
	query Customer($customerAccessToken: String!) {
		customer(customerAccessToken: $customerAccessToken) {
			id
		}
	}
`)

export { GET_COLLECTION, GET_COLLECTION_MAX_PRICE, GET_PRODUCT, GET_CUSTOMER, GET_CUSTOMER_ID_ONLY }
