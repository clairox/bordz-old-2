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

const UPDATE_CUSTOMER = gql(`
	mutation UpdateCustomer(
		$customerAccessToken: String!
		$firstName: String
		$lastName: String
		$email: String
		$password: String
	) {
		customerUpdate(
			customerAccessToken: $customerAccessToken, customer: { firstName: $firstName, lastName: $lastName, email: $email, password: $password }
		) {
			customer {
				id
				email
				firstName
				lastName
				displayName
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
			userErrors {
				field
				message
			}
		}
	}			
`)

const CREATE_CART = gql(`
	mutation CartCreate {
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

export { LOGIN, SIGNUP, UPDATE_CUSTOMER, CREATE_CART }
