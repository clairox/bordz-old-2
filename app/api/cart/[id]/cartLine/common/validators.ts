import {
    ensureArray,
    ensureBoolean,
    ensureImage,
    ensureMoney,
    ensureNullableMoney,
    ensureNumber,
    ensureString,
} from '@/lib/utils/typeGuarding'
import { Cart, CartLine, CartLineMerchandise } from '@/types/store'

const ensureCartLineMerchandise = (merchandise: any): CartLineMerchandise => ({
    availableForSale: ensureBoolean(merchandise.availableForSale),
    compareAtPrice: ensureNullableMoney(merchandise.compareAtPrice),
    id: ensureString(merchandise.id),
    price: ensureMoney(merchandise.priceV2),
    product: {
        handle: ensureString(merchandise.product.handle),
        id: ensureString(merchandise.product.id),
        images: ensureArray(merchandise.product.images.nodes, ensureImage),
        title: ensureString(merchandise.product.title),
    },
    quantityAvailable: ensureNumber(merchandise.quantityAvailable),
    title: ensureString(merchandise.title),
})

const ensureCartLine = (line: any): CartLine => ({
    cost: {
        amountPerQuantity: ensureMoney(line.cost.subtotalAmount),
        compareAtAmountPerQuantity: ensureMoney(line.cost.totalAmount),
        subtotalAmount: ensureMoney(line.cost.subtotalAmount),
        totalAmount: ensureMoney(line.cost.totalAmount),
    },
    id: ensureString(line.id),
    merchandise: ensureCartLineMerchandise(line.merchandise),
    quantity: ensureNumber(line.quantity),
})

export const toSafeCart = (cart: any): Cart => {
    const error = new Error('Safe cart conversion failed')
    if (!cart) {
        console.error(error)
        throw error
    }

    try {
        const safeCart: Cart = {
            id: ensureString(cart.id),
            cost: {
                subtotalAmount: ensureMoney(cart.cost.subtotalAmount),
                totalAmount: ensureMoney(cart.cost.totalAmount),
            },
            lines: ensureArray(cart.lines.nodes, ensureCartLine),
            totalQuantity: ensureNumber(cart.totalQuantity),
        }

        return safeCart
    } catch {
        console.error(error)
        throw error
    }
}
