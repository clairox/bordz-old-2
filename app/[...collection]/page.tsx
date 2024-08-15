'use client'
import CollectionView from '@/components/Collection/CollectionView'
import useSearchParamsObject from '@/hooks/useSearchParamsObject'
import { fetcher } from '@/lib/fetcher'
import { ProductListItem } from '@/types/store'
import { useParams } from 'next/navigation'
import { useEffect, useState } from 'react'

const Page = () => {
	const [products, setProducts] = useState<ProductListItem[] | undefined>(undefined)
	const [hasNextPage, setHasNextPage] = useState(false)
	const [maxPrice, setMaxPrice] = useState(Infinity)
	const [productCount, setProductCount] = useState(NaN)

	const params = useParams()
	const searchParams = useSearchParamsObject()

	useEffect(() => {
		if (products === undefined) {
			const [handle, subcategory] = params.collection as string[]

			let url = `/collection?handle=${handle}`
			if (subcategory) {
				url += `subcategory=${subcategory}`
			}
			Object.keys(searchParams).forEach(key => (url += `${key}=${searchParams[key]}`))

			fetcher(url)
				.then(response => {
					setProducts(response.data.products)
					setHasNextPage(response.data.hasNextPage)
					setMaxPrice(response.data.maxPrice)
					setProductCount(response.data.productCount)
				})
				.catch(error => {
					// TODO 500 page
				})
		}
	}, [params, searchParams, products])

	if (products) {
		return (
			<CollectionView
				products={products}
				maxPrice={maxPrice}
				hasNextPage={hasNextPage}
				productCount={productCount}
			/>
		)
	}

	return <></>
}

export default Page
