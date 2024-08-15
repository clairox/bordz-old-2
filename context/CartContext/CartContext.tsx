'use client'
import {
	AddCartLineMutation,
	GetCartQuery,
	UpdateCartLineMutation,
	RemoveCartLineMutation,
	CreateCartMutation,
} from '@/__generated__/storefront/graphql'
import { fetcher } from '@/lib/fetcher'
import { FetcherError } from '@/lib/fetcher/fetcher'
import {
	ADD_CART_LINE,
	UPDATE_CART_LINE,
	REMOVE_CART_LINE,
	CREATE_CART,
} from '@/lib/storefrontAPI/mutations'
import { GET_CART } from '@/lib/storefrontAPI/queries'
import { toSafeCart } from '@/lib/utils/gql'
import { Cart } from '@/types/store'
import { useLazyQuery, useMutation } from '@apollo/client'
import React, { createContext, useCallback, useContext, useEffect, useState } from 'react'

type CartContextType = {
	cart: Cart | null
	addCartLine: (variantId: string, quantity: number) => Promise<Cart | null> // TODO let quantity be optional
	updateCartLine: (lineId: string, updatedProperties: { quantity: number }) => Promise<Cart | null>
	deleteCartLine: (lineId: string) => Promise<Cart | null>
}

const defaultCartContextValue = {
	cart: null,
	addCartLine: async (variantId: string, quantity: number) => null,
	updateCartLine: async (lineId: string, updatedProperties: { quantity: number }) => null,
	deleteCartLine: async (lineId: string) => null,
}

const CartContext = createContext<CartContextType>(defaultCartContextValue)

export const CartProvider: React.FunctionComponent<React.PropsWithChildren> = ({ children }) => {
	const providedCart = useProvideCart()
	return <CartContext.Provider value={providedCart}>{children}</CartContext.Provider>
}

export const useCartContext = () => useContext(CartContext)

const useProvideCart = () => {
	const [cart, setCart] = useState<Cart | null>(null)

	const [getCartQuery] = useLazyQuery(GET_CART)
	const [createCartMutation] = useMutation(CREATE_CART)
	const [addCartLineMutation] = useMutation(ADD_CART_LINE)
	const [updateCartLineMutation] = useMutation(UPDATE_CART_LINE)
	const [removeCartLineMutation] = useMutation(REMOVE_CART_LINE)

	const getCartIdFromCustomer = async (): Promise<string | null> => {
		try {
			const response = await fetcher('/internalCustomer')
			const { cartId } = response.data

			return cartId
		} catch (error) {
			if (error instanceof FetcherError) {
				if (error.response.status === 401) {
					return null
				} else {
					throw error
				}
			} else {
				throw error
			}
		}
	}

	const createCart = useCallback(async (): Promise<{ __typename?: 'Cart'; id: string } | null> => {
		try {
			const { data } = await createCartMutation()

			const createCartResult = data?.cartCreate as CreateCartMutation['cartCreate']
			const userErrors = createCartResult?.userErrors
			if (userErrors && userErrors.length > 0) {
				return null
			}

			const cart = createCartResult?.cart
			if (cart == undefined) {
				return null
			}

			return cart
		} catch (error) {
			throw error
		}
	}, [createCartMutation])

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
			const { data, error } = await getCartQuery({ variables: { id } })
			const cart = data?.cart as GetCartQuery['cart']
			if (error || cart == undefined) {
				return null
			}

			const safeCart = toSafeCart(cart)
			setCart(safeCart)
			return safeCart
		} catch (error) {
			throw new Error('A problem occurred while trying to retrieve the cart.')
		}
	}, [loadCartId, getCartQuery])

	useEffect(() => {
		//loadCart()
	}, [loadCart])

	const updateCartLine = useCallback(
		async (lineId: string, updatedProperties: { quantity: number }): Promise<Cart | null> => {
			let id = localStorage.getItem('cartId') || (await loadCartId())

			try {
				const { quantity } = updatedProperties
				const { data } = await updateCartLineMutation({
					variables: {
						cartId: id,
						lineId,
						quantity,
					},
				})

				const updateCartLineResult =
					data?.cartLinesUpdate as UpdateCartLineMutation['cartLinesUpdate']

				const userErrors = updateCartLineResult?.userErrors
				if (userErrors && userErrors.length > 0) {
					return null
				}

				const updatedCart = updateCartLineResult?.cart
				if (updatedCart == undefined) {
					return null
				}

				const safeUpdatedCart = toSafeCart(updatedCart)
				setCart(safeUpdatedCart)
				return safeUpdatedCart
			} catch (error) {
				throw new Error('A problem occurred while trying to update the cart.')
			}
		},
		[loadCartId, updateCartLineMutation]
	)

	const addCartLine = useCallback(
		// TODO default quantity to 1
		async (variantId: string, quantity: number): Promise<Cart | null> => {
			let id = localStorage.getItem('cartId') || (await loadCartId())

			if (cart === null) {
				return null
			}

			const existingLine = cart.lines.find(line => line.merchandise.id === variantId)
			if (existingLine) {
				const quantityAvailable = existingLine.merchandise.quantityAvailable
				const newQuantity = existingLine.quantity + quantity
				return updateCartLine(existingLine.id, {
					quantity: Math.min(quantityAvailable, newQuantity),
				})
			}

			try {
				const { data } = await addCartLineMutation({
					variables: {
						cartId: id,
						variantId,
						quantity,
					},
				})

				const addCartLineResult = data?.cartLinesAdd as AddCartLineMutation['cartLinesAdd']

				const userErrors = addCartLineResult?.userErrors
				if (userErrors && userErrors.length > 0) {
					return null
				}

				const updatedCart = addCartLineResult?.cart
				if (updatedCart == undefined) {
					return null
				}

				const safeUpdatedCart = toSafeCart(updatedCart)
				setCart(safeUpdatedCart)
				return safeUpdatedCart
			} catch (error) {
				throw new Error('A problem occurred while trying to update the cart.')
			}
		},
		[cart, loadCartId, addCartLineMutation, updateCartLine]
	)

	const deleteCartLine = useCallback(
		async (lineId: string): Promise<Cart | null> => {
			let id = localStorage.getItem('cartId') || (await loadCartId())

			try {
				const { data } = await removeCartLineMutation({
					variables: {
						cartId: id,
						lineId,
					},
				})

				const removeCartLineResult =
					data?.cartLinesRemove as RemoveCartLineMutation['cartLinesRemove']

				const userErrors = removeCartLineResult?.userErrors
				if (userErrors && userErrors.length > 0) {
					return null
				}

				const updatedCart = removeCartLineResult?.cart
				if (updatedCart == undefined) {
					return null
				}

				const safeUpdatedCart = toSafeCart(updatedCart)
				setCart(safeUpdatedCart)
				return safeUpdatedCart
			} catch (error) {
				throw new Error('A problem occurred while trying to update the cart.')
			}
		},
		[loadCartId, removeCartLineMutation]
	)

	return { cart, addCartLine, updateCartLine, deleteCartLine }
}
