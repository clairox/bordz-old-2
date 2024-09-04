'use client'
import useProduct from '@/hooks/useProduct'
import ProductDetails from '@/components/ProductDetails'
import { BreadcrumbTrail, Product } from '@/types/store'
import Image from 'next/image'
import { Breadcrumb, BreadcrumbList } from '@/components/UI/Breadcrumb'
import useMakeBreadcrumbItems from '@/hooks/useMakeBreadcrumbItems'

const Page: React.FunctionComponent<{ params: { handle: string } }> = ({ params }) => {
    const { data, error, isPending } = useProduct(params.handle)
    const makeBreadcrumbItems = useMakeBreadcrumbItems()

    if (error) {
        console.error(error)
        return <></>
    }

    if (isPending) {
        return <div>Loading...</div>
    }

    const product: Product = data

    const trail: BreadcrumbTrail = {
        home: { title: 'Home', href: '/', parent: null },
        department: {
            title: product.department,
            href: '/' + product.department.toLowerCase().replace(' ', '-'),
            parent: 'home',
        },
        collection: {
            title: product.collection.title,
            href: '/' + product.collection.handle,
            parent: 'department',
        },
        product: { title: product.title, href: null, parent: 'collection' },
    }

    return (
        <div>
            <Breadcrumb className="pl-6 py-5 w-full border-b border-black">
                <BreadcrumbList>{makeBreadcrumbItems(trail.product!, trail)}</BreadcrumbList>
            </Breadcrumb>{' '}
            <div className="grid grid-cols-12">
                <div className="col-span-8 flex flex-col gap-[1px] border-r border-black bg-black">
                    {product.images.map(image => (
                        <Image
                            src={image.src}
                            alt={image.altText || 'product image'}
                            width={image.width}
                            height={image.height}
                            key={image.src}
                        />
                    ))}
                </div>
                <div className="col-span-4 ">
                    <ProductDetails product={product}>
                        <div className="flex justify-between gap-16 px-6 pb-1 border-b border-black">
                            <div className="flex flex-col gap-3 pb-4">
                                <ProductDetails.Title />
                                <ProductDetails.Price />
                            </div>
                            <ProductDetails.WishlistButton />
                        </div>
                        <div className="flex flex-col gap-10 px-6 py-4">
                            <ProductDetails.Selector />
                            <ProductDetails.CartButton />
                            <ProductDetails.Description />
                        </div>
                        <div className="px-6"></div>
                    </ProductDetails>
                </div>
            </div>
        </div>
    )
}

export default Page
