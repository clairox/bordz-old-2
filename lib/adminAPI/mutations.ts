import { gql } from '@/__generated__/admin'

const CREATE_CUSTOMER_METAFIELDS = gql(`
	mutation CreateCustomerMetafields($id: ID!, $birthDate: String!, $cartId: String!, $wishlist: String!) {
		customerUpdate(
			input: {
				id: $id
				metafields: [
					{
						key: "birthdate"
						namespace: "custom"
						type: "single_line_text_field"
						value: $birthDate
					}
					{
						key: "cartid"
						namespace: "custom"
						type: "single_line_text_field"
						value: $cartId
					}
					{
						key: "wishlist"
						namespace: "custom"
						type: "json"
						value: $wishlist
					}
				]
			}
		) {
			customer {
				id
			}	
			userErrors {
				field
				message
			}
		}
	}	
`)

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

export { CREATE_CUSTOMER_METAFIELDS, DELETE_CUSTOMER }
