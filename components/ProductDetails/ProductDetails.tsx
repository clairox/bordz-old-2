import { Button } from '@/components/UI/Button'
import { CartProvider, useCart } from '@/context/CartContext'
import { useCartMutations } from '@/hooks/useCartMutations'
import { useWishlistMutations } from '@/hooks/useWishlistMutations'
import { isItemInWishlist } from '@/lib/core/wishlists'
import { Product, Variant } from '@/types/store'
import { HeartStraight } from '@phosphor-icons/react'
import { PropsWithChildren, createContext, useCallback, useContext, useState } from 'react'

const ProductDetailsContext = createContext<Product | undefined>(undefined)

const useProductDetails = () => {
    const product = useContext(ProductDetailsContext)

    const { data: cart } = useCart()
    const { addCartLine } = useCartMutations(cart?.id || '')

    const [selectedVariant, setSelectedVariant] = useState<Variant>(product!.variants[0])
    const [isInWishlist, setIsInWishlist] = useState(isItemInWishlist(selectedVariant.id))

    const handleSelectVariant = useCallback(
        (id: string) => {
            const variant = product?.variants.find(variant => variant.id === id)
            if (variant) {
                setSelectedVariant(variant)
            }
        },
        [product?.variants],
    )

    const { addWishlistItem, removeWishlistItem } = useWishlistMutations()

    const handleCartButton = useCallback(async () => {
        addCartLine.mutate({ variantId: selectedVariant.id })
    }, [addCartLine, selectedVariant])

    const handleWishlistButton = useCallback(async () => {
        const item = selectedVariant.id
        if (item && isInWishlist) {
            removeWishlistItem.mutate(item, { onSuccess: () => setIsInWishlist(false) })
        } else if (item) {
            addWishlistItem.mutate(item, { onSuccess: () => setIsInWishlist(true) })
        }
    }, [isInWishlist, selectedVariant, removeWishlistItem, addWishlistItem])

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
        isInWishlist,
        handleSelectVariant,
        handleCartButton,
        handleWishlistButton,
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
    const { variants, selectedVariant, handleSelectVariant } = useProductDetails()

    return (
        <div className="flex flex-col gap-2">
            <p>Size:</p>
            <div className="flex gap-3 flex-wrap">
                {variants.map(variant => {
                    return (
                        <Button
                            onClick={() => handleSelectVariant(variant.id)}
                            disabled={variants.length === 1}
                            key={variant.id}
                            className={`${variants.length > 1 && selectedVariant.id === variant.id ? 'font-semibold bg-black text-white hover:bg-black hover:text-white cursor-default' : 'bg-gray-200 text-black hover:bg-gray-300'} w-14 h-14 `}
                        >
                            {variant.title}
                        </Button>
                    )
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
    const { handleCartButton } = useProductDetails()
    return (
        <Button className="h-14 text-lg font-semibold" onClick={handleCartButton}>
            Add to Bag
        </Button>
    )
}

const ProductDetailsWishlistButton = () => {
    const { isInWishlist, handleWishlistButton } = useProductDetails()
    const size = 35
    return (
        <div className="">
            <button onClick={handleWishlistButton}>
                {isInWishlist ? (
                    <HeartStraight size={size} weight="fill" />
                ) : (
                    <HeartStraight size={size} weight="light" />
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
