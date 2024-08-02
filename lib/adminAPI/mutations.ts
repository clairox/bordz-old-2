import { gql } from '@/__generated__/admin'

const DELETE_CUSTOMER = gql(`
	mutation CustomerDelete($id: ID!) {
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
