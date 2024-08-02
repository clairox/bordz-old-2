import { GetProductQuery } from '@/__generated__/storefront/graphql'
import { GET_PRODUCT } from '@/lib/storefrontAPI/queries'
import { toSafeProduct } from '@/lib/utils/gql'
import { useSuspenseQuery } from '@apollo/client/react/hooks'

const useProduct = (handle: string) => {
	const { data, error } = useSuspenseQuery(GET_PRODUCT, { variables: { handle } })

	const fetchedProduct = data.productByHandle as GetProductQuery['productByHandle']
	const product = toSafeProduct(fetchedProduct)

	return { product, error }
}

export { useProduct }
