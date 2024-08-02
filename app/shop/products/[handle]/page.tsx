import ProductView from '@/components/Product/ProductView'
import { PreloadQuery } from '@/lib/apollo/apolloClient'
import { GET_PRODUCT } from '@/lib/storefrontAPI/queries'

const Page: React.FunctionComponent<{ params: { handle: string } }> = async ({ params }) => {
	const handle = params.handle

	return (
		<PreloadQuery query={GET_PRODUCT} variables={{ handle }}>
			<ProductView />
		</PreloadQuery>
	)
}

export default Page
