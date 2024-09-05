'use client'
import Cart from '@/components/CartBase'
import { useCart } from '@/context/CartContext'
import { useCartMutations } from '@/hooks/useCartMutations'
import { CartLine } from '@/types/store'
import { Trash } from '@phosphor-icons/react'

const MiniCart = () => {
    return (
        <Cart>
            <div className="flex flex-col gap-[1px]">
                <div className="bg-white">
                    <Cart.LineItems>
                        {cartLines => (
                            <>
                                {cartLines.map(line => (
                                    <MiniCartLine cartLine={line} key={line.id} />
                                ))}
                            </>
                        )}
                    </Cart.LineItems>
                </div>
                <div className="flex flex-col gap-10 p-4 bg-white">
                    <div className="flex justify-between">
                        <p>Subtotal:</p>

                        <Cart.Subtotal />
                    </div>
                    <div className="flex justify-end gap-4">
                        <Cart.ViewCartButton />
                        <Cart.CheckoutButton />
                    </div>
                </div>
            </div>
        </Cart>
    )
}

type MiniCartLineProps = {
    cartLine: CartLine
}

const MiniCartLine: React.FunctionComponent<MiniCartLineProps> = ({ cartLine }) => {
    const { data: cart } = useCart()
    const { deleteCartLine } = useCartMutations(cart?.id || '')

    const merchandise = cartLine.merchandise
    const productHref = '/products/' + merchandise.product.handle

    const handleDeleteButton = () => {
        deleteCartLine.mutate(cartLine.id)
    }

    return (
        <Cart.LineItem cartLine={cartLine} key={cartLine.id}>
            <div className="basis-1/3">
                <Cart.LineImage
                    image={merchandise.product.featuredImage}
                    productHref={productHref}
                />
            </div>
            <div className="basis-2/3 flex flex-col justify-between pr-4 pt-3 pb-4">
                <div className="flex justify-between items-start gap-10">
                    <Cart.LineTitle title={merchandise.product.title} productHref={productHref} />
                    <button data-testid="deleteButton" onClick={handleDeleteButton}>
                        <Trash size={20} weight="regular" />
                    </button>
                </div>
                <div className="flex justify-between items-center">
                    <Cart.LineSizeAttr size={merchandise.title} />
                    <Cart.LineCounter
                        quantity={cartLine.quantity}
                        availableQuantity={merchandise.quantityAvailable}
                        lineId={cartLine.id}
                    />
                </div>
            </div>
        </Cart.LineItem>
    )
}

export default MiniCart
