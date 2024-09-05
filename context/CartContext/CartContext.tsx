'use client'

import { restClient, RestClientError } from '@/lib/clients/restClient'
import { Cart } from '@/types/store'
import React, { createContext, useCallback, useContext } from 'react'
import { useQuery } from '@tanstack/react-query'

type CartContextType = {
    data: Cart | undefined
    error: Error | null
    isPending: boolean
}

const defaultCartContextValue = {
    data: undefined,
    error: null,
    isPending: true,
}

const CartContext = createContext<CartContextType>(defaultCartContextValue)

export const CartProvider: React.FunctionComponent<React.PropsWithChildren> = ({ children }) => {
    const providedCart = useProvideCart()
    return <CartContext.Provider value={providedCart}>{children}</CartContext.Provider>
}

export const useCart = () => useContext(CartContext)

const useProvideCart = () => {
    const getCartIdFromCustomer = async (): Promise<string | undefined> => {
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

    const createCart = useCallback(async (): Promise<Cart | undefined> => {
        try {
            const response = await restClient('/cart', { method: 'POST' })
            return response.data
        } catch (error) {
            return undefined
        }
    }, [])

    const getCartId = useCallback(async () => {
        const cartIdFromLocal = localStorage.getItem('cartId')

        if (cartIdFromLocal) {
            return cartIdFromLocal
        }

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
    }, [createCart])

    const fetchCart = useCallback(async () => {
        let id = await getCartId()

        try {
            const response = await restClient(`/cart/${encodeURIComponent(id)}`)

            return response.data
        } catch (error) {
            throw error
        }
    }, [getCartId])

    const cartQuery = useQuery({
        queryKey: ['getCart'],
        queryFn: fetchCart,
    })

    return cartQuery
}
