import { Button } from '@/components/UI/Button'
import { CartProvider, useCart } from '@/context/CartContext'
import {
    useAddCartLineMutation,
    useAddWishlistItemMutation,
    useRemoveWishlistItemMutation,
} from '@/hooks'
import { isItemInWishlist } from '@/lib/core/wishlists'
import { Product, Variant } from '@/types/store'
import { HeartStraight } from '@phosphor-icons/react'
import { PropsWithChildren, createContext, useCallback, useContext, useMemo, useState } from 'react'

const ProductDetailsContext = createContext<Product | undefined>(undefined)

const useProductDetails = () => {
    const product = useContext(ProductDetailsContext)

    const [selectedVariant, setSelectedVariant] = useState<Variant>(product!.variants[0])
    const [isInWishlist, setIsInWishlist] = useState(isItemInWishlist(selectedVariant.id))

    if (product == undefined) {
        throw new Error('Cannot be used outside of context')
    }

    return {
        title: product.title,
        price: selectedVariant.price.amount,
        compareAtPrice: selectedVariant.compareAtPrice?.amount,
        description: product.description,
        variants: product.variants,
        selectedVariant,
        setSelectedVariant,
        isInWishlist,
        setIsInWishlist,
    }
}

type ProductDetailsProps = PropsWithChildren<{
    product: Product
}>

const ProductDetails = ({ children, product }: ProductDetailsProps) => {
    return (
        <ProductDetailsContext.Provider value={product}>
            <CartProvider>
                <div className="sticky top-0 flex flex-col gap-2 pt-8 pb-32">{children}</div>
            </CartProvider>
        </ProductDetailsContext.Provider>
    )
}

const ProductDetailsTitle = () => {
    const { title } = useProductDetails()
    return <h1 className=" text-xl">{title}</h1>
}

const ProductDetailsPrice = () => {
    const { price, compareAtPrice } = useProductDetails()

    if (compareAtPrice) {
        return (
            <div className="flex gap-1 text-red">
                <span className="text-sm text-gray-700 line-through">${price}</span>
                <span>${compareAtPrice}</span>
            </div>
        )
    }

    return <div>${price}</div>
}

const ProductDetailsSelectors = ({ children }: PropsWithChildren) => {
    return <div>{children}</div>
}

const ProductDetailsSelector = () => {
    const { variants, selectedVariant, setSelectedVariant } = useProductDetails()

    const handleSelectVariant = useCallback(
        (id: string) => {
            const variant = variants.find(variant => variant.id === id)
            if (variant) {
                setSelectedVariant(variant)
            }
        },
        [variants, setSelectedVariant],
    )

    return (
        <div className="flex flex-col gap-2">
            <p>Size:</p>
            <div className="flex gap-3 flex-wrap">
                {variants.map(variant => {
                    const baseStyle = 'w-14 h-14'

                    if (variant.id === selectedVariant.id) {
                        return (
                            <Button
                                disabled={true}
                                className={`${baseStyle} font-semibold bg-black text-white hover:bg-black hover:text-white cursor-default`}
                                key={variant.id}
                            >
                                {variant.title}
                            </Button>
                        )
                    } else {
                        return (
                            <Button
                                onClick={() => handleSelectVariant(variant.id)}
                                className={`${baseStyle} bg-gray-200 text-black hover:bg-gray-300`}
                                key={variant.id}
                            >
                                {variant.title}
                            </Button>
                        )
                    }
                })}
            </div>
        </div>
    )
}

const ProductDetailsDescription = () => {
    const { description } = useProductDetails()
    return (
        <div>
            <p className="pb-2 font-semibold">Description</p>
            <p>{description}</p>
        </div>
    )
}

// TODO: should say out of stock if product.availableForSale === false
const ProductDetailsCartButton = () => {
    const { selectedVariant } = useProductDetails()
    const { data: cart } = useCart()
    const { mutate: addCartLine, status, reset } = useAddCartLineMutation()

    const buttonContent = useMemo(() => {
        if (status === 'idle') {
            return 'Add to Bag'
        }

        if (status === 'pending') {
            return 'Adding...'
        }

        if (status === 'success') {
            setTimeout(() => reset(), 3000)
            return 'Added!'
        }
    }, [status, reset])

    const handleCartButton = useCallback(async () => {
        if (cart == undefined) {
            return
        }

        const variables = {
            cartId: cart.id,
            variantId: selectedVariant.id,
        }

        addCartLine(variables)
    }, [cart, addCartLine, selectedVariant])

    return (
        <Button className="h-14 text-lg font-semibold" onClick={handleCartButton}>
            {buttonContent}
        </Button>
    )
}

const ProductDetailsWishlistButton = () => {
    const { isInWishlist, selectedVariant, setIsInWishlist } = useProductDetails()
    const { mutate: addWishlistItem } = useAddWishlistItemMutation()
    const { mutate: removeWishlistItem } = useRemoveWishlistItemMutation()

    const handleWishlistButton = useCallback(async () => {
        const item = selectedVariant.id
        const variables = { item }

        if (isInWishlist) {
            const options = { onSuccess: () => setIsInWishlist(false) }
            removeWishlistItem(variables, options)
        } else {
            const options = { onSuccess: () => setIsInWishlist(true) }
            addWishlistItem(variables, options)
        }
    }, [isInWishlist, setIsInWishlist, selectedVariant, removeWishlistItem, addWishlistItem])

    const iconSize = 35

    return (
        <div className="">
            <button onClick={handleWishlistButton}>
                {isInWishlist ? (
                    <HeartStraight size={iconSize} weight="fill" />
                ) : (
                    <HeartStraight size={iconSize} weight="light" />
                )}
            </button>
        </div>
    )
}

ProductDetails.Title = ProductDetailsTitle
ProductDetails.Price = ProductDetailsPrice
ProductDetails.Selectors = ProductDetailsSelectors
ProductDetails.Selector = ProductDetailsSelector
ProductDetails.Description = ProductDetailsDescription
ProductDetails.CartButton = ProductDetailsCartButton
ProductDetails.WishlistButton = ProductDetailsWishlistButton

export default ProductDetails
