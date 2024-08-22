'use client'

import { restClient, RestClientError } from '@/lib/clients/restClient'
import { Cart } from '@/types/store'
import React, { createContext, useCallback, useContext, useEffect, useState } from 'react'
import { useAuth } from '../AuthContext/AuthContext'

type CartContextType = {
    cart: Cart | undefined
    addCartLine: (variantId: string, quantity: number) => Promise<Cart | undefined> // TODO: let quantity be optional
    updateCartLine: (lineId: string, data: { quantity: number }) => Promise<Cart | undefined>
    deleteCartLine: (lineId: string) => Promise<Cart | undefined>
}

const defaultCartContextValue = {
    cart: undefined,
    addCartLine: async () => undefined,
    updateCartLine: async () => undefined,
    deleteCartLine: async () => undefined,
}

const CartContext = createContext<CartContextType>(defaultCartContextValue)

export const CartProvider: React.FunctionComponent<React.PropsWithChildren> = ({ children }) => {
    const providedCart = useProvideCart()
    return <CartContext.Provider value={providedCart}>{children}</CartContext.Provider>
}

export const useCartContext = () => useContext(CartContext)

const useProvideCart = () => {
    const [cart, setCart] = useState<Cart | undefined>(undefined)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<any | undefined>(undefined)

    const { customerId } = useAuth()

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
            setError(error)
            return undefined
        }
    }, [])

    const loadCartId = useCallback(async () => {
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

    const loadCart = useCallback(async () => {
        let id = localStorage.getItem('cartId') || (await loadCartId())

        try {
            const response = await restClient(`/cart/${encodeURIComponent(id)}`)

            setCart(response.data)
            return response.data
        } catch (error) {
            setError(error)
        }
    }, [loadCartId])

    useEffect(() => {
        loadCart()
    }, [loadCart, customerId])

    const updateCartLine = useCallback(
        async (lineId: string, data: { quantity: number }): Promise<Cart | undefined> => {
            let id = localStorage.getItem('cartId') || (await loadCartId())

            try {
                const response = await restClient(`/cart/${encodeURIComponent(id)}/cartLines`, {
                    method: 'PATCH',
                    body: JSON.stringify({
                        lines: [
                            {
                                id: lineId,
                                quantity: data.quantity,
                            },
                        ],
                    }),
                })

                setCart(response.data)
                return response.data
            } catch (error) {
                setError(error)
                return undefined
            }
        },
        [loadCartId],
    )

    const addCartLine = useCallback(
        // TODO: default quantity to 1
        async (variantId: string, quantity: number): Promise<Cart | undefined> => {
            let id = localStorage.getItem('cartId') || (await loadCartId())

            try {
                const response = await restClient(`/cart/${encodeURIComponent(id)}/cartLines`, {
                    method: 'POST',
                    body: JSON.stringify({
                        lines: [
                            {
                                merchandiseId: variantId,
                                quantity,
                            },
                        ],
                    }),
                })

                setCart(response.data)
                return response.data
            } catch (error) {
                setError(error)
                return undefined
            }
        },
        [loadCartId],
    )

    const deleteCartLine = useCallback(
        async (lineId: string): Promise<Cart | undefined> => {
            let id = localStorage.getItem('cartId') || (await loadCartId())

            try {
                const response = await restClient(`/cart/${encodeURIComponent(id)}/cartLines`, {
                    method: 'DELETE',
                    body: JSON.stringify({
                        lineIds: [lineId],
                    }),
                })

                setCart(response.data)
                return response.data
            } catch (error) {
                setError(error)
                return undefined
            }
        },
        [loadCartId],
    )

    return { cart, addCartLine, updateCartLine, deleteCartLine }
}
