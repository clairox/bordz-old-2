'use client'
import { useState } from 'react'
import CollectionHeader from '@/components/Collection/CollectionHeader'
import CollectionSidebar from '@/components/Collection/CollectionSidebar'
import CollectionProductList from '@/components/Collection/CollectionProductList'
import CollectionFooter from '@/components/Collection/CollectionFooter'
import { useRouter, useParams, usePathname, useSearchParams } from 'next/navigation'
import { useCollection } from '@/hooks/useCollection'

const Page = () => {
    const router = useRouter()
    const pathname = usePathname()
    const params = useParams()
    const searchParams = useSearchParams()
    const { title, subcategoryTitles, products, productCount, maxPrice, hasNextPage, loading } =
        useCollection(searchParams)

    const [openRefinements, setOpenRefinements] = useState<string[]>([])

    return (
        <div>
            <CollectionHeader
                title={title}
                subcategoryTitles={subcategoryTitles}
                pathname={pathname}
            />
            <div className="grid grid-cols-5">
                <aside className="border-l border-black">
                    <CollectionSidebar
                        maxPrice={maxPrice}
                        openRefinements={openRefinements}
                        setOpenRefinements={setOpenRefinements}
                    />
                </aside>
                <main className="col-span-4 border-l border-black">
                    {products && (
                        <>
                            <CollectionProductList products={products} loading={loading} />
                            <CollectionFooter
                                productCount={products.length}
                                totalProductCount={productCount}
                                hasNextPage={hasNextPage}
                                pathname={pathname}
                                router={router}
                                searchParams={searchParams}
                            />
                        </>
                    )}
                </main>
            </div>
        </div>
    )

    return <></>
}

export default Page
