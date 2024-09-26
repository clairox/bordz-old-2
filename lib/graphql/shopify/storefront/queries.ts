import { gql } from '@/__generated__/storefront'

const GET_CART = gql(`
	query GetCart($id: ID!) {
		cart(id: $id) {
			id
			totalQuantity
			lines(first: 20, reverse: true) {
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
								featuredImage {
                                    altText
                                    height
                                    id
                                    src
                                    width
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
		$first: Int!
        $after: String
		$sortKey: ProductCollectionSortKeys
		$filters: [ProductFilter!]
		$reverse: Boolean = false
	) {
		collection(handle: $handle) {
			title
			products(first: $first, after: $after, sortKey: $sortKey, reverse: $reverse, filters: $filters) {
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
                    endCursor
					hasNextPage
				}
				filters {
					label
					values {
						label
						count
                        input 
					}
				}
			}
            metafields(identifiers: [
                { key: "related_collections" namespace: "custom"} 
                { key: "department" namespace: "custom" }
            ]) {
                key
                value
                references(first: 10) {
                    nodes {
                        ... on Collection {
                            handle
                            title
                        }
                    }
                }
            }
		}
	}
`)

const GET_PRODUCT_SEARCH = gql(`
	query GetProductSearch(
		$query: String!
		$first: Int!
        $after: String
		$sortKey: SearchSortKeys
		$filters: [ProductFilter!]
		$reverse: Boolean = false
	) {
		search(
            query: $query 
            first: $first
            after: $after
            sortKey: $sortKey
            reverse: $reverse
            productFilters: $filters
            unavailableProducts: LAST
        ) {
            nodes {
                ... on Product {
                    availableForSale
                    handle
                    id    					
                    title
                    totalInventory
                    updatedAt
                    vendor
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
            } 
            pageInfo {
                endCursor
                hasNextPage
            }
            productFilters {
                label
                values {
                    label
                    count
                    input 
                }
            }
        }
	}
`)

const GET_PRODUCT_FILTERS = gql(`
	query GetProductFilters(
		$handle: String!
        $first: Int!
		$filters: [ProductFilter!]
	) {
		collection(handle: $handle) {
			products(first: $first, filters: $filters) {
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
	) {
		collection(handle: $handle) {
			products(first: 1, sortKey: PRICE, reverse: true) {
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

const GET_PRODUCT_SEARCH_MAX_PRICE = gql(`
	query GetProductSearchMaxPrice(
		$query: String!
	) {
        search(
            query: $query
            first: 1
            sortKey: PRICE
            reverse: true
            unavailableProducts: LAST
        ) {
            nodes {
                ... on Product {
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
            availableForSale
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
            metafields(identifiers: [
                { key: "collection" namespace: "custom"} 
                { key: "department" namespace: "custom" }
            ]) {
                key
                value
                reference {
                    ... on Collection {
                        handle
                        title
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
					lineItems(first: 25) {
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

const GET_WISHLIST = gql(`
    query GetWishlist($customerAccessToken: String!) {
        customer(customerAccessToken: $customerAccessToken) {
            id
            metafield(namespace: "custom", key: "wishlist") {
                value
            }
        }
    }
`)

export {
    GET_CART,
    GET_COLLECTION,
    GET_COLLECTION_MAX_PRICE,
    GET_PRODUCT_SEARCH,
    GET_PRODUCT_SEARCH_MAX_PRICE,
    GET_PRODUCT_FILTERS,
    GET_PRODUCT,
    GET_CUSTOMER,
    GET_CUSTOMER_ID_ONLY,
    GET_WISHLIST,
}
