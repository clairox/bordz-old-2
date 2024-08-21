'use client'
import { Button } from '@/components/UI/Button'
import { useCartContext } from '@/context/CartContext'
import { removeWishlistItem } from '@/lib/services/core/wishlists'
import { WishlistItem } from '@/types/store'
import { Trash } from '@phosphor-icons/react'
import Image from 'next/image'
import Link from 'next/link'

type WishlistProps = {
    wishlist: WishlistItem[]
    dispatch: React.Dispatch<any>
    limit: number
}

const Wishlist: React.FunctionComponent<WishlistProps> = ({ wishlist, dispatch, limit }) => {
    return (
        <main className="grid grid-cols-4 border-l border-black">
            {wishlist.map(item => {
                return (
                    <WishlistListItem key={item.id} item={item} dispatch={dispatch} limit={limit} />
                )
            })}
        </main>
    )
}

type WishlistItemProps = {
    item: WishlistItem
    dispatch: React.Dispatch<any>
    limit: number
}

const WishlistListItem: React.FunctionComponent<WishlistItemProps> = ({
    item,
    dispatch,
    limit,
}) => {
    const product = item.product
    const { addCartLine } = useCartContext()

    // TODO: move wishlist item deletion to parent component
    const removeFromWishlist = async () => {
        dispatch({ type: 'FETCH_START' })

        try {
            const data = await removeWishlistItem(item.id, limit)
            dispatch({ type: 'FETCH_SUCCESS', payload: data })
        } catch (error) {
            // TODO: handle error
            console.error(error)
        }
    }

    const handleAddCartLine = async (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        event.preventDefault()

        const value = await addCartLine(item.id, 1)
        if (value != undefined) {
            removeFromWishlist()
        }
    }

    const handleRemoveWishlistItem = async (
        event: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    ) => {
        event.preventDefault()
        removeFromWishlist()
    }

    return (
        <article className="border-r border-b border-black">
            <Link href={`/items/${product.handle}`}>
                <div className="relative border-b border-gray">
                    <Image
                        src={product.featuredImage.src}
                        alt={product.featuredImage.altText || 'product image'}
                        width={product.featuredImage.width}
                        height={product.featuredImage.height}
                    />
                    <button
                        className="absolute top-0 right-0 flex justify-center items-center m-3 w-10 h-10 rounded-full bg-white"
                        onClick={handleRemoveWishlistItem}
                    >
                        <Trash size={30} weight={'light'} />
                    </button>
                </div>
                <div className="px-4 pt-4 pb-2 leading-5 tracking-tight">
                    <div className="h-12">
                        <p className="line-clamp-2">{product.title}</p>
                    </div>
                    <div className="mb-1 text-gray-600">
                        {item.selectedOptions[0].name}: {item.selectedOptions[0].value}
                    </div>
                    <div className="font-semibold text-lg">${item.price}</div>
                </div>
                <div className="w-full h-14">
                    <Button
                        className="w-full h-full border-t border-black bg-white text-lg text-black hover:bg-gray-100"
                        onClick={handleAddCartLine}
                    >
                        Add to Cart
                    </Button>
                </div>
            </Link>
        </article>
    )
}

export default Wishlist
