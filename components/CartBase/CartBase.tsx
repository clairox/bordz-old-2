'use client'
import React, { PropsWithChildren } from 'react'
import { CartLine, Image as ImageType } from '@/types/store'
import { useCart } from '@/context/CartContext'
import { Button } from '@/components/UI/Button'
import Counter from '@/components/UI/Counter'
import { MIN_CART_LINE_ITEM_QUANTITY } from '@/lib/utils/constants'
import Image from 'next/image'
import Link from 'next/link'
import { useCartMutations } from '@/hooks/useCartMutations'
import eventEmitter from '@/lib/utils/eventEmitter'

const Cart = ({ children }: PropsWithChildren) => {
    const { data: cart, error, isPending } = useCart()

    if (error) {
        console.error(error)
        return <></>
    }

    if (isPending) {
        return <div>Loading...</div>
    }

    if (cart!.totalQuantity === 0) {
        return <div>Your cart is empty</div>
    }

    return <div className="bg-black">{children}</div>
}

type CartLineItemsProps = {
    children: (cartLines: CartLine[]) => React.ReactNode
}

const CartLineItems = ({ children }: CartLineItemsProps) => {
    const { data: cart } = useCart()

    return <div className="flex flex-col gap-[1px] bg-black">{children(cart!.lines)}</div>
}

type CartLineItemProps = PropsWithChildren<{
    cartLine: CartLine
}>

const CartLineItem = ({ children }: CartLineItemProps) => {
    return <article className="flex gap-4 bg-white">{children}</article>
}

type CartLineTitleProps = {
    title: string
    productHref: string
}

const CartLineTitle = ({ title, productHref }: CartLineTitleProps) => {
    const handleClick = () => {
        eventEmitter.emit('linkClick')
    }

    return (
        <Link href={productHref} onClick={handleClick} className="hover:underline">
            <span className="font-semibold line-clamp-2">{title}</span>
        </Link>
    )
}

type CartLinePriceProps = {
    price: number
}

const CartLinePrice = ({ price }: CartLinePriceProps) => {
    return <p>${price}</p>
}

type CartLineCounterProps = {
    quantity: number
    availableQuantity: number
    lineId: string
}

type CartLineSizeAttrProps = {
    size: string | number
}
const CartLineSizeAttr = ({ size }: CartLineSizeAttrProps) => {
    return (
        <div>
            Size: <span>{size}</span>
        </div>
    )
}

const CartLineCounter = ({ quantity, availableQuantity, lineId }: CartLineCounterProps) => {
    const { data: cart } = useCart()
    const { updateCartLine } = useCartMutations(cart!.id)
    return (
        <Counter
            value={quantity}
            min={MIN_CART_LINE_ITEM_QUANTITY}
            max={availableQuantity}
            canType={true}
            onChange={quantity => updateCartLine.mutate({ lineId, quantity })}
        />
    )
}

type CartLineImageProps = {
    image: ImageType
    productHref: string
}

const CartLineImage = ({ image, productHref }: CartLineImageProps) => {
    const handleClick = () => {
        eventEmitter.emit('linkClick')
    }

    return (
        <Link href={productHref} onClick={handleClick}>
            <Image
                src={image.src}
                alt={image.altText || 'product image'}
                width={image.width}
                height={image.height}
            />
        </Link>
    )
}

const CartSubtotal = () => {
    const { data: cart } = useCart()

    return <p>${cart!.cost.subtotalAmount.amount.toFixed(2)}</p>
}

const CartCheckoutButton = () => {
    return <Button onClick={() => {}}>Checkout</Button>
}

const CartViewCartButton = () => {
    return <Button onClick={() => {}}>View Cart</Button>
}

Cart.LineItems = CartLineItems
Cart.LineItem = CartLineItem
Cart.LineTitle = CartLineTitle
Cart.LinePrice = CartLinePrice
Cart.LineSizeAttr = CartLineSizeAttr
Cart.LineCounter = CartLineCounter
Cart.LineImage = CartLineImage
Cart.Subtotal = CartSubtotal
Cart.CheckoutButton = CartCheckoutButton
Cart.ViewCartButton = CartViewCartButton

export default Cart
