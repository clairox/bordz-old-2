import { Cart } from '@/types/store'
import { RestClientError, restClient } from '../clients/restClient'

const getCart = async (id: string): Promise<Cart> => {
    try {
        const response = await restClient('/cart/' + id)
        return response.data
    } catch (error) {
        throw error
    }
}

export const createCart = async (): Promise<Cart> => {
    try {
        const response = await restClient('/cart', {
            method: 'POST',
        })
        return response.data
    } catch (error) {
        throw error
    }
}

export const loadCartId = async () => {
    const cartIdFromCustomer = await getCartIdFromCustomer()
    if (cartIdFromCustomer) {
        localStorage.setItem('cartId', cartIdFromCustomer)
        return cartIdFromCustomer
    }

    const newCart = await createCart()
    if (newCart == undefined) {
        throw new Error('Something went wrong.')
    }

    const newCartId = newCart.id

    localStorage.setItem('cartId', newCartId)
    return newCartId
}

export const getCartIdFromCustomer = async (): Promise<string | undefined> => {
    try {
        const response = await restClient('/customer')
        const { cartId } = response.data

        return cartId
    } catch (error) {
        if (error instanceof RestClientError) {
            if (error.response.status === 401) {
                return undefined
            } else {
                throw error
            }
        } else {
            throw error
        }
    }
}

export { getCart }
