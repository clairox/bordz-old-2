import { gql } from '@/__generated__'

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

export { LOGIN, SIGNUP }
