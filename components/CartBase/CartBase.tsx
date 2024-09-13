'use client'
import React, { PropsWithChildren } from 'react'
import { CartLine, Image as ImageType } from '@/types/store'
import { useCart } from '@/context/CartContext'
import { Button } from '@/components/UI/Button'
import Counter from '@/components/UI/Counter'
import { MIN_CART_LINE_ITEM_QUANTITY } from '@/lib/utils/constants'
import Image from 'next/image'
import Link from 'next/link'
import eventEmitter from '@/lib/utils/eventEmitter'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { restClient } from '@/lib/clients/restClient'

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
    return <p>${price.toFixed(2)}</p>
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
    type UpdateCartLineVariables = {
        cartId: string
        lineId: string
        quantity: number
    }

    const queryClient = useQueryClient()

    const { mutate: updateCartLine } = useMutation({
        mutationFn: async ({ cartId, lineId, quantity }: UpdateCartLineVariables) => {
            try {
                const response = await restClient(`/cart/${encodeURIComponent(cartId)}/cartLines`, {
                    method: 'PATCH',
                    body: JSON.stringify({
                        lines: [
                            {
                                id: lineId,
                                quantity,
                            },
                        ],
                    }),
                })

                return response.data
            } catch (error) {
                throw error
            }
        },
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ['getCart'] }),
    })

    const { data: cart } = useCart()

    const handleChangeQuantity = (quantity: number) => {
        if (cart == undefined) {
            return
        }

        const variables = {
            cartId: cart.id,
            lineId,
            quantity,
        }

        updateCartLine(variables)
    }

    return (
        <Counter
            value={quantity}
            min={MIN_CART_LINE_ITEM_QUANTITY}
            max={availableQuantity}
            canType={true}
            onChange={quantity => handleChangeQuantity(quantity)}
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

type CartLineDeleteButtonProps = PropsWithChildren<{
    lineId: string
}>

const CartLineDeleteButton = ({ children, lineId }: CartLineDeleteButtonProps) => {
    type DeleteCartLineVariables = {
        cartId: string
        lineId: string
    }

    const queryClient = useQueryClient()

    const { mutate: deleteCartLine } = useMutation({
        mutationFn: async ({ cartId, lineId }: DeleteCartLineVariables) => {
            try {
                const response = await restClient(`/cart/${encodeURIComponent(cartId)}/cartLines`, {
                    method: 'DELETE',
                    body: JSON.stringify({
                        lineIds: [lineId],
                    }),
                })

                return response.data
            } catch (error) {
                throw error
            }
        },
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ['getCart'] }),
    })

    const { data: cart } = useCart()

    const handleDeleteCartLine = () => {
        if (cart == undefined) {
            return
        }

        const variables = {
            cartId: cart.id,
            lineId,
        }

        deleteCartLine(variables)
    }

    return (
        <button data-testid="deleteButton" onClick={handleDeleteCartLine}>
            {children}
        </button>
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
Cart.LineDeleteButton = CartLineDeleteButton
Cart.Subtotal = CartSubtotal
Cart.CheckoutButton = CartCheckoutButton
Cart.ViewCartButton = CartViewCartButton

export default Cart
