'use client'
import { Button } from '@/components/UI/Button'
import { ProductGrid } from '@/components/UI/ProductGrid'
import { useCartMutations } from '@/hooks/useCartMutations'
import useWishlist from '@/hooks/useWishlist/useWishlist'
import { useWishlistMutations } from '@/hooks/useWishlistMutations'
import { WishlistItem } from '@/types/store'
import { Trash } from '@phosphor-icons/react'
import { useMemo } from 'react'

const Page = () => {
    const limit = 40
    const cartId = useMemo(() => {
        if (typeof localStorage !== 'undefined') {
            return localStorage.getItem('cartId') || ''
        }

        return ''
    }, [])
    const { data, error, fetchNextPage, hasNextPage, isFetchingNextPage, status } =
        useWishlist(limit)
    const { removeWishlistItem } = useWishlistMutations(limit)
    const { addCartLine } = useCartMutations(cartId)

    if (error) {
        // TODO: handle error
        console.error(error)
        return <></>
    }

    if (status === 'pending') {
        return <div>Loading...</div>
    }

    const wishlist: WishlistItem[] = []
    data!.pages.forEach(item =>
        item.populatedWishlist.forEach(wishlistItem => wishlist.push(wishlistItem)),
    )

    const handleAddToCart = (
        event: React.MouseEvent<HTMLButtonElement, MouseEvent>,
        item: string,
    ) => {
        event.preventDefault()
        addCartLine.mutate(
            { variantId: item, quantity: 1 },
            { onSuccess: () => removeWishlistItem.mutate(item) },
        )
    }

    const handleRemoveWishlistItem = (
        event: React.MouseEvent<HTMLButtonElement, MouseEvent>,
        item: string,
    ) => {
        event.preventDefault()
        removeWishlistItem.mutate(item)
    }

    // TODO: Don't nest clickables within clickables
    // TODO: Make only title and image link to product
    return (
        <div>
            <h1>Wishlist</h1>
            <ProductGrid>
                {wishlist.map(item => {
                    const { product } = item
                    return (
                        <ProductGrid.Item handle={product.handle} key={item.id}>
                            <div className="relative">
                                <ProductGrid.Image
                                    src={product.featuredImage.src}
                                    alt={product.featuredImage.altText || 'product image'}
                                    width={product.featuredImage.width}
                                    height={product.featuredImage.height}
                                />
                                <button
                                    className="absolute top-0 right-0 flex justify-center items-center m-3 w-10 h-10 rounded-full bg-white"
                                    onClick={event => handleRemoveWishlistItem(event, item.id)}
                                >
                                    <Trash size={30} weight={'light'} />
                                </button>
                            </div>
                            <ProductGrid.Details>
                                <ProductGrid.Title>{product.title}</ProductGrid.Title>
                                <div className="mb-1 text-gray-600">
                                    {item.selectedOptions[0].name}: {item.selectedOptions[0].value}
                                </div>{' '}
                                {item.compareAtPrice ? (
                                    <div>
                                        <span className="text-red line-through">${item.price}</span>
                                        ${item.compareAtPrice}
                                    </div>
                                ) : (
                                    <div>${item.price}</div>
                                )}
                                <div className="w-full h-14">
                                    <Button
                                        className="w-full h-full rounded-none border-t border-black bg-white text-lg text-black hover:bg-gray-100"
                                        onClick={event => handleAddToCart(event, item.id)}
                                    >
                                        Add to Bag
                                    </Button>
                                </div>{' '}
                            </ProductGrid.Details>
                        </ProductGrid.Item>
                    )
                })}
            </ProductGrid>
            {hasNextPage && !isFetchingNextPage && (
                <Button onClick={() => fetchNextPage()}>Load More</Button>
            )}
        </div>
    )
}

export default Page
