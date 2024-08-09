import { gql } from '@/__generated__/storefront'

const LOGIN = gql(`
	mutation Login(
		$email: String!
		$password: String!
	) {
		customerAccessTokenCreate(
			input: { email: $email, password: $password }
		) {
			customerAccessToken {
				accessToken
				expiresAt
			}
			customerUserErrors {
				code
				field
				message
			}
		}
	}
`)

const CREATE_ACCESS_TOKEN = gql(`
	mutation CreateAccessToken(
		$email: String!
		$password: String!
	) {
		customerAccessTokenCreate(
			input: { email: $email, password: $password }
		) {
			customerAccessToken {
				accessToken
				expiresAt
			}
			customerUserErrors {
				code
				field
				message
			}
			userErrors {
				field
				message
			}
		}
	}
`)

const SIGNUP = gql(`
	mutation Signup(
		$firstName: String!
		$lastName: String!
		$email: String!
		$password: String!
	) {
		customerCreate(
			input: { firstName: $firstName, lastName: $lastName, email: $email, password: $password }
		) {
			customer {
				id
				email
			}
			customerUserErrors {
				code
				field
				message
			}
			userErrors {
				field
				message
			}
		}
	}
`)

const CREATE_CUSTOMER = gql(`
	mutation CreateCustomer(
		$email: String!
		$password: String!
		$firstName: String!
		$lastName: String!
		$phone: String
	) {
		customerCreate(
			input: { firstName: $firstName, lastName: $lastName, email: $email, password: $password, phone: $phone }
		) {
			customer {
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
			customerUserErrors {
				code
				field
				message
			}
		}
	}
`)

const UPDATE_CUSTOMER = gql(`
	mutation UpdateCustomer(
		$customerAccessToken: String!
		$email: String
		$firstName: String
		$lastName: String
		$phone: String
		$password: String
	) {
		customerUpdate(
			customerAccessToken: $customerAccessToken, customer: { firstName: $firstName, lastName: $lastName, email: $email, phone: $phone, password: $password }
		) {
			customer {
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
			customerAccessToken {
				accessToken
				expiresAt
			}
			customerUserErrors {
				code
				field
				message
			}
		}
	}			
`)

const CREATE_CART = gql(`
	mutation CreateCart {
		cartCreate {
			cart {
				id
			}
			userErrors {
				code
				field
				message
			}
		}
	}
`)

const ADD_CART_LINES = gql(`
	mutation AddCartLines(
		$cartId: ID!
		$lines: [CartLineInput!]!
	) {
		cartLinesAdd(cartId: $cartId, lines: $lines) {
			cart {
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
			userErrors {
				code
				field
				message
			}
		}
	}
`)

const ADD_CART_LINE = gql(`
	mutation AddCartLine(
		$cartId: ID!
		$variantId: ID!
		$quantity: Int!
	) {
		cartLinesAdd(cartId: $cartId, lines: { merchandiseId: $variantId, quantity: $quantity }) {
			cart {
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
			userErrors {
				code
				field
				message
			}
		}
	}
`)

const UPDATE_CART_LINE = gql(`
	mutation UpdateCartLine(
		$cartId: ID!
		$lineId: ID!
		$quantity: Int
	) {
		cartLinesUpdate(cartId: $cartId, lines: { id: $lineId, quantity: $quantity }) {
			cart {
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
			userErrors {
				code
				field
				message
			}
		}
	}
`)

const REMOVE_CART_LINE = gql(`
	mutation RemoveCartLine(
		$cartId: ID!
		$lineId: ID!
	) {
		cartLinesRemove(cartId: $cartId, lineIds: [$lineId]) {
			cart {
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
			userErrors {
				code
				field
				message
			}
		}
	}
`)

export {
	LOGIN,
	SIGNUP,
	CREATE_ACCESS_TOKEN,
	CREATE_CUSTOMER,
	UPDATE_CUSTOMER,
	CREATE_CART,
	ADD_CART_LINES,
	ADD_CART_LINE,
	UPDATE_CART_LINE,
	REMOVE_CART_LINE,
}
