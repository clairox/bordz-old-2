'use client'
import Image from 'next/image'
import Link from 'next/link'

type ProductListItem = {
	title: string
	handle: string
	price: number
	featuredImage: {
		src: string
		width: number
		height: number
	}
}

const ProductListView: React.FunctionComponent<{
	products: ProductListItem[]
	productCount: number
}> = ({ products, productCount }) => {
	if (products.length > 0) {
		return (
			<div className="grid grid-cols-4">
				{products.map((item: ProductListItem) => {
					return <ProductListViewItem key={item.handle} product={item} />
				})}
			</div>
		)
	}
}

const ProductListViewItem: React.FunctionComponent<{ product: ProductListItem }> = ({
	product,
}) => {
	return (
		<article className="border-r border-b border-black">
			<Link href={`/shop/products/${product.handle}`}>
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
					<div className="font-semibold">${product.price}</div>
				</div>
			</Link>
		</article>
	)
}

export { ProductListView }
