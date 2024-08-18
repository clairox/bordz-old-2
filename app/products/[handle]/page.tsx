'use client'
import useProduct from '@/hooks/useProduct'
import ProductGallery from '@/components/Product/ProductGallery'
import ProductInfo from '@/components/Product/ProductInfo'

const Page: React.FunctionComponent<{ params: { handle: string } }> = ({ params }) => {
    const { product, loading, error } = useProduct(params.handle)

    if (loading) {
        return <div>Loading...</div>
    }

    if (error) {
        // TODO: error
        console.error(error)
        return <></>
    }

    if (product == undefined) {
        // TODO: error
        return <></>
    }

    return (
        <div className="flex">
            <ProductGallery images={product.images} />
            <ProductInfo
                id={product.id}
                title={product.title}
                variants={product.variants}
                description={product.description}
            />
        </div>
    )
}

export default Page
