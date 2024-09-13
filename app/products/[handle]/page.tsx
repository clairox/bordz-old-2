import ProductView from '@/components/Views/ProductView'
import { getQueryClient } from '@/lib/clients/queryClient'
import { restClient } from '@/lib/clients/restClient'
import { FunctionComponent } from 'react'

type ProductPageProps = {
    params: { handle: string }
}

const ProductPage: FunctionComponent<ProductPageProps> = ({ params }) => {
    const queryClient = getQueryClient()
    void queryClient.prefetchQuery({
        queryKey: ['getProduct', params.handle],
        queryFn: async () => {
            const url = '/products/' + params.handle

            try {
                const response = await restClient(url)
                return response.data
            } catch (error) {
                throw error as Error
            }
        },
    })

    return <ProductView handle={params.handle} />
}

export default ProductPage
