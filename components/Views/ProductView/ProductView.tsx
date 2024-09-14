'use client'
import { FunctionComponent, useMemo, useState } from 'react'
import { BreadcrumbTrail, Image as Img, Product, Variant } from '@/types/store'
import Image from 'next/image'
import {
    useAddCartLineMutation,
    useAddSavedItemMutation,
    useProductQuery,
    useRemoveSavedItemMutation,
} from '@/hooks'
import Breadcrumb from '@/components/Breadcrumb'
import { isItemSaved } from '@/lib/core/wishlists'
import { HeartStraight } from '@phosphor-icons/react'
import { Button } from '@/components/UI/Button'
import { CartProvider, useCart } from '@/context/CartContext'

type ProductViewProps = {
    handle: string
}

const ProductView: FunctionComponent<ProductViewProps> = ({ handle }) => {
    const { data, error, isPending } = useProductQuery(handle)

    if (error) {
        console.error(error)
        return <></>
    }

    if (isPending) {
        return <div>Loading...</div>
    }

    const product: Product = data

    const trail: BreadcrumbTrail = {
        home: { title: 'Home', href: '/', parent: null },
        department: {
            title: product.department,
            href: '/' + product.department.toLowerCase().replace(' ', '-'),
            parent: 'home',
        },
        collection: {
            title: product.collection.title,
            href: '/' + product.collection.handle,
            parent: 'department',
        },
        product: { title: product.title, href: null, parent: 'collection' },
    }

    return (
        <div>
            <div className="pl-6 py-5 w-full border-b border-black">
                <Breadcrumb endNode={trail.product!} trail={trail} />
            </div>
            <div className="grid grid-cols-12">
                <ProductGallery images={product.images} />
                <ProductDetails product={product} />
            </div>
        </div>
    )
}

type ProductGalleryProps = {
    images: Img[]
}

const ProductGallery: FunctionComponent<ProductGalleryProps> = ({ images }) => {
    return (
        <div className="col-span-8 flex flex-col gap-[1px] border-r border-black bg-black">
            {images.map(image => (
                <Image
                    src={image.src}
                    alt={image.altText || 'product image'}
                    width={image.width}
                    height={image.height}
                    key={image.src}
                />
            ))}
        </div>
    )
}

type ProductDetailsProps = {
    product: Product
}

const ProductDetails: FunctionComponent<ProductDetailsProps> = ({ product }) => {
    const { title, variants, description } = product

    const [selectedVariant, setSelectedVariant] = useState(variants[0])

    const selectVariant = (id: string) => {
        const variant = variants.find(variant => variant.id === id)
        if (variant == undefined) {
            throw new Error('Invalid variant id')
        }

        setSelectedVariant(variant)
    }

    const Price = () => {
        const { price, compareAtPrice } = selectedVariant
        if (compareAtPrice) {
            return (
                <div className="flex gap-1 text-red">
                    <span className="text-sm text-gray-700 line-through">${price.amount}</span>
                    <span>${compareAtPrice.amount}</span>
                </div>
            )
        } else {
            return <div>${price.amount}</div>
        }
    }

    return (
        <div className="col-span-4">
            <div className="sticky top-0 flex flex-col gap-2 pt-8 pb-32">
                <div className="flex justify-between gap-16 px-6 pb-1 border-b border-black">
                    <div className="flex flex-col gap-3 pb-4">
                        <h1 className=" text-xl">{title}</h1>
                        <Price />
                    </div>
                    <SaveButton variant={selectedVariant} />
                </div>
                <div className="flex flex-col gap-10 px-6 py-4">
                    <div className="flex flex-col gap-2">
                        <p>Size:</p>
                        <div className="flex gap-3 flex-wrap">
                            {variants.map(variant => {
                                const isSelected = variant.id === selectedVariant.id
                                return (
                                    <VariantSelectorButton
                                        variant={variant}
                                        isSelected={isSelected}
                                        selectVariant={selectVariant}
                                        key={variant.id}
                                    />
                                )
                            })}
                        </div>
                    </div>
                    <CartProvider>
                        <AddToCartButton variant={selectedVariant} />
                    </CartProvider>
                    <div>
                        <p className="pb-2 font-semibold">Description</p>
                        <p>{description}</p>
                    </div>
                </div>
                <div className="px-6"></div>
            </div>
        </div>
    )
}

type SaveButtonProps = {
    variant: Variant
}

const SaveButton: FunctionComponent<SaveButtonProps> = ({ variant }) => {
    const [isSaved, setIsSaved] = useState(isItemSaved(variant.id))

    const { mutate: saveItem } = useAddSavedItemMutation()
    const { mutate: unsaveItem } = useRemoveSavedItemMutation()

    const handleClick = () => {
        const id = variant.id
        const variables = { id }

        if (isSaved) {
            const options = { onSuccess: () => setIsSaved(false) }
            unsaveItem(variables, options)
        } else {
            const options = { onSuccess: () => setIsSaved(true) }
            saveItem(variables, options)
        }
    }

    const ButtonIcon = () => {
        const iconSize = 35

        if (isSaved) {
            return <HeartStraight size={iconSize} weight="fill" />
        } else {
            return <HeartStraight size={iconSize} weight="light" />
        }
    }

    return (
        <div className="">
            <button onClick={handleClick}>
                <ButtonIcon />
            </button>
        </div>
    )
}

type VariantSelectorButtonProps = {
    variant: Variant
    isSelected: boolean
    selectVariant: (id: string) => void
}

const VariantSelectorButton: FunctionComponent<VariantSelectorButtonProps> = ({
    variant,
    isSelected,
    selectVariant,
}) => {
    const handleClick = () => selectVariant(variant.id)

    return (
        <Button
            disabled={isSelected}
            onClick={handleClick}
            className={`w-14 h-10 disabled:opacity-100 disabled:bg-black disabled:text-white border border-black bg-white text-black hover:bg-gray-100 font-semibold`}
        >
            {variant.title}
        </Button>
    )
}

type AddToCartButtonProps = {
    variant: Variant
}

const AddToCartButton: FunctionComponent<AddToCartButtonProps> = ({ variant }) => {
    const { data: cart } = useCart()
    const { mutate: addCartLine, status, reset } = useAddCartLineMutation()

    const isDisabled = useMemo(() => {
        return !variant.availableForSale || status === 'pending' || status === 'success'
    }, [variant, status])

    const buttonContent = useMemo(() => {
        if (!variant.availableForSale) {
            return 'Out of Stock'
        }

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
    }, [variant, status, reset])

    const handleCartButton = async () => {
        if (cart == undefined) {
            return
        }

        const variables = {
            cartId: cart.id,
            variantId: variant.id,
        }

        addCartLine(variables)
    }

    return (
        <Button
            disabled={isDisabled}
            className="h-14 text-lg font-semibold"
            onClick={handleCartButton}
        >
            {buttonContent}
        </Button>
    )
}

export default ProductView
