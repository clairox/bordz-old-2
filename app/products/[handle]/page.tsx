import ProductView from '@/components/Views/ProductView'
import { FunctionComponent } from 'react'

type ProductPageProps = {
    params: { handle: string }
}

const ProductPage: FunctionComponent<ProductPageProps> = ({ params }) => {
    // TODO: prefetch product

    return <ProductView handle={params.handle} />
}

export default ProductPage
