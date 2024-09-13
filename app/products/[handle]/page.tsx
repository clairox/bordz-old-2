import ProductView from '@/components/Views/ProductView'
import { getQueryClient } from '@/lib/clients/queryClient'
import { getProductQueryOptions } from '@/lib/utils/helpers'
import { FunctionComponent } from 'react'

type ProductPageProps = {
    params: { handle: string }
}

const ProductPage: FunctionComponent<ProductPageProps> = ({ params }) => {
    const queryClient = getQueryClient()
    void queryClient.prefetchQuery(getProductQueryOptions(params.handle))

    return <ProductView handle={params.handle} />
}

export default ProductPage
