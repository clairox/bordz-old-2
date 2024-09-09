import { ProductListItem } from '@/types/store'
import { ProductGrid } from '../UI/ProductGrid'
import Link from 'next/link'

type CollectionProductListItemProps = {
    product: ProductListItem
}

const CollectionProductListItem: React.FunctionComponent<CollectionProductListItemProps> = ({
    product,
}) => {
    return (
        <ProductGrid.Item key={product.title}>
            <Link href={'/products/' + product.handle}>
                <ProductGrid.Image
                    src={product.featuredImage.src}
                    alt={product.featuredImage.altText || 'product image'}
                    width={product.featuredImage.width}
                    height={product.featuredImage.height}
                />
            </Link>
            <ProductGrid.Details>
                <Link href={'/products/' + product.handle}>
                    <ProductGrid.Title>{product.title}</ProductGrid.Title>
                </Link>
                {product.compareAtPrice ? (
                    <div>
                        <span className="text-red line-through">${product.price.amount}</span>$
                        {product.compareAtPrice.amount}
                    </div>
                ) : (
                    <div>${product.price.amount}</div>
                )}
            </ProductGrid.Details>
        </ProductGrid.Item>
    )
}

export default CollectionProductListItem
