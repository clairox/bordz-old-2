import { gql } from '@/__generated__/storefront'

const GET_CART = gql(`
	query GetCart($id: ID!) {
		cart(id: $id) {
			id
			totalQuantity
			lines(first: 20) {
				nodes {
					id
					quantity
					merchandise {
						... on ProductVariant {
							availableForSale
							compareAtPriceV2 {
								amount
								currencyCode
							}
							id
							title
							priceV2 {
								amount
								currencyCode
							}
							product {
								handle
								id
								title
								images(first: 1) {
									nodes {
										altText
										height
										src
										width
									}
								}
							}
							quantityAvailable
						}
					}
					cost {
						amountPerQuantity {
							amount
							currencyCode
						}
						compareAtAmountPerQuantity {
							amount
							currencyCode
						}
						subtotalAmount {
							amount
							currencyCode
                    	}
						totalAmount {
							amount
							currencyCode
						}
					}
				}
			}
			cost {
				subtotalAmount {
					amount
					currencyCode
				}
				totalAmount {
					amount
					currencyCode
				}
			}
		}
	}	
`)

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
					availableForSale
					handle
					id
					title
					totalInventory
					featuredImage {
						src
						width
						height
					}
					compareAtPriceRange {
						maxVariantPrice {
							amount
							currencyCode
						}
					}
					priceRange {
						maxVariantPrice {
							amount
							currencyCode
						}
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

const GET_PRODUCT_FILTERS = gql(`
	query GetProductFilters(
		$handle: String!
		$limit: Int!
		$filters: [ProductFilter!]
	) {
		collection(handle: $handle) {
			products(first: $limit, filters: $filters) {
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
		productByHandle(handle: $handle) {
			description
			handle
			id
			productType
			tags
			title
			vendor
			images(first: 10) {
				nodes {
					altText
					height
					id
					src
					width
				}
			}
			variants(first: 10) {
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
			metafields(identifiers: [
					{ namespace: "custom", key: "cartid" },
					{ namespace: "custom", key: "birthdate" },
					{ namespace: "custom", key: "wishlist" },
				]) {
				key
				value
			}
		}
	}
`)

const GET_CUSTOMER_ID_ONLY = gql(`
	query GetCustomerIdOnly($customerAccessToken: String!) {
		customer(customerAccessToken: $customerAccessToken) {
			id
		}
	}
`)

export {
    GET_CART,
    GET_COLLECTION,
    GET_PRODUCT_FILTERS,
    GET_COLLECTION_MAX_PRICE,
    GET_PRODUCT,
    GET_CUSTOMER,
    GET_CUSTOMER_ID_ONLY,
}
