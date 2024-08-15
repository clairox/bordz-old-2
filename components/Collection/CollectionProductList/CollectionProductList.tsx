'use client'
import { ProductListItem } from '@/types/store'
import Image from 'next/image'
import Link from 'next/link'

const CollectionProductList: React.FunctionComponent<{
	products: ProductListItem[]
}> = ({ products }) => {
	if (products.length > 0) {
		return (
			<div className="grid grid-cols-4">
				{products.map((product: ProductListItem) => {
					return <CollectionProductListItem key={product.handle} product={product} />
				})}
			</div>
		)
	}
}

const CollectionProductListItem: React.FunctionComponent<{ product: ProductListItem }> = ({
	product,
}) => {
	return (
		<article className="border-r border-b border-black">
			<Link href={`/products/${product.handle}`}>
				<div className="border-b border-gray">
					<Image
						src={product.featuredImage.src}
						alt="skateboard deck graphic"
						width={product.featuredImage.width}
						height={product.featuredImage.height}
					/>
				</div>
				<div className="px-4 pt-4 pb-5 leading-5 tracking-tight">
					<div className="h-12">
						<span className="line-clamp-2">{product.title}</span>
					</div>
					<div className="font-semibold">${product.price.amount}</div>
				</div>
			</Link>
		</article>
	)
}

export default CollectionProductList
export { CollectionProductListItem }
