import { gql } from '@/__generated__/admin'

const GET_WISHLIST_ITEMS = gql(`
	query GetWishlistItems(
		$limit: Int!
		$query: String!
	) {
	productVariants(first: $limit, query: $query) {
        nodes {
            availableForSale
            compareAtPrice
            id
            price
            title
            product {
                handle
                id
                title
                featuredImage {
                    altText
                    height
                    src
                    width
                }
            }
            selectedOptions {
                name
                value
            }
        }
        pageInfo {
            hasNextPage
        }
    }	
}
`)
const GET_VARIANTS = gql(`
	query GetProductVariants(
		$limit: Int!
		$query: String!
	) {
	productVariants(first: $limit, query: $query) {
        nodes {
            availableForSale
            compareAtPrice
            id
            price
            title
            product {
                handle
                id
                title
                featuredImage {
                    altText
                    height
                    src
                    width
                }
            }
            selectedOptions {
                name
                value
            }
        }
        pageInfo {
            hasNextPage
        }
    }	
}
`)

export { GET_VARIANTS, GET_WISHLIST_ITEMS }
