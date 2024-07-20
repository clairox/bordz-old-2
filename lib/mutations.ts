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

export { LOGIN }
