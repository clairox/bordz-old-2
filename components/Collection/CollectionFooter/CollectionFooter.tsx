import { ProductListItem } from '@/types'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import React from 'react'

const CollectionFooter: React.FunctionComponent<{
	products: ProductListItem[]
	productCount: number
	hasNextPage: boolean
}> = ({ products, productCount, hasNextPage }) => {
	const router = useRouter()
	const pathname = usePathname()
	const searchParams = useSearchParams()

	const startParam = +(searchParams.get('start') || 0)

	const handleLoadMore = () => {
		const params = new URLSearchParams(searchParams.toString())
		params.set('start', (startParam + 40).toString())
		router.replace(pathname + '?' + params.toString(), { scroll: false })
	}
	return (
		<div>
			<p>
				Showing {products.length} of {productCount} products
			</p>
			{hasNextPage && <button onClick={handleLoadMore}>Load More</button>}
		</div>
	)
}

export default CollectionFooter
