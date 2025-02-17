'use client'
import { Button } from '@/components/UI/Button'
import { ProductGrid } from '@/components/UI/ProductGrid'
import { useCart } from '@/context/CartContext'
import { useAddCartLineMutation, useRemoveSavedItemMutation, useSavedItemsQuery } from '@/hooks'
import { SavedItem } from '@/types/store'
import { Trash } from '@phosphor-icons/react'
import Link from 'next/link'

const Page = () => {
    const limit = 40
    const { data: cart } = useCart()
    const { data, error, fetchNextPage, hasNextPage, isFetchingNextPage, status } =
        useSavedItemsQuery(limit)
    const { mutate: removeSavedItem } = useRemoveSavedItemMutation()
    const { mutate: addCartLine } = useAddCartLineMutation()

    if (error) {
        // TODO: handle error
        console.error(error)
        return <></>
    }

    if (status === 'pending') {
        return <div>Loading...</div>
    }

    const savedItems: SavedItem[] = []
    data!.pages.forEach(item =>
        item.populatedItems.forEach(savedItem => savedItems.push(savedItem)),
    )

    const handleAddToCart = (id: string) => {
        if (cart == undefined) {
            return
        }

        const variables = {
            cartId: cart.id,
            variantId: id,
        }
        const options = {
            onSuccess: () => removeSavedItem({ id }),
        }

        addCartLine(variables, options)
    }

    const handleRemoveSavedItem = (id: string) => {
        removeSavedItem({ id })
    }

    // TODO: wrap in CartProvider and move add to cart logic to CartButton
    return (
        <div>
            <h1>Saved Items</h1>
            <ProductGrid>
                {savedItems.map(item => {
                    const { product } = item
                    return (
                        <ProductGrid.Item key={item.id}>
                            <div className="relative">
                                <Link href={'/products/' + product.handle}>
                                    <ProductGrid.Image
                                        src={product.featuredImage.src}
                                        alt={product.featuredImage.altText || 'product image'}
                                        width={product.featuredImage.width}
                                        height={product.featuredImage.height}
                                    />
                                </Link>
                                <button
                                    className="absolute top-0 right-0 flex justify-center items-center m-3 w-10 h-10 rounded-full bg-white"
                                    onClick={() => handleRemoveSavedItem(item.id)}
                                >
                                    <Trash size={30} weight={'light'} />
                                </button>
                            </div>
                            <ProductGrid.Details>
                                <Link href={'/products/' + product.handle}>
                                    <ProductGrid.Title>{product.title}</ProductGrid.Title>
                                </Link>
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
                                        onClick={() => handleAddToCart(item.id)}
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
