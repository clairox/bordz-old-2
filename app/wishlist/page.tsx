'use client'
import { Button } from '@/components/UI/Button'
import { ProductGrid } from '@/components/UI/ProductGrid'
import useWishlist from '@/hooks/useWishlist/useWishlist'
import { useWishlistMutations } from '@/hooks/useWishlistMutations'
import { WishlistData } from '@/types/store'
import { Trash } from '@phosphor-icons/react'

const Page = () => {
    const limit = 40
    const { data, error, isPending } = useWishlist(limit)
    const { removeWishlistItemMutation, fetchMore } = useWishlistMutations(limit)

    if (error) {
        // TODO: handle error
        console.error(error)
        return <></>
    }

    if (isPending) {
        return <div>Loading...</div>
    }

    const { populatedWishlist: wishlist, hasNextPage } = data as WishlistData

    const handleRemoveWishlistItem = (
        event: React.MouseEvent<HTMLButtonElement, MouseEvent>,
        item: string,
    ) => {
        removeWishlistItemMutation.mutate(item)
    }

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
                                        onClick={() => {}}
                                    >
                                        Add to Bag
                                    </Button>
                                </div>{' '}
                            </ProductGrid.Details>
                        </ProductGrid.Item>
                    )
                })}
            </ProductGrid>
            {hasNextPage && <Button onClick={fetchMore}>Load More</Button>}
        </div>
    )
}

export default Page
