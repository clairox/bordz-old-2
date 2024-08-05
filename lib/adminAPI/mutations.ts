import { gql } from '@/__generated__/admin'

const DELETE_CUSTOMER = gql(`
	mutation DeleteCustomer($id: ID!) {
		customerDelete(input: { id: $id }) {
			deletedCustomerId
			userErrors {
				field
				message
			}
		}
	}
`)

export { DELETE_CUSTOMER }
