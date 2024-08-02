'use client'
import React, { useCallback, useContext, useEffect, useReducer, useState } from 'react'
import { createContext } from 'react'
import type { CartItem, Product } from '@/types'
import { makeCartItem } from '@/lib/utils/cart'
import { preload } from 'swr'
import { LocalCart } from '@/lib/localCart/localCart'

type GetItemOptions = {
	refresh?: boolean
}

type CartContextValue = {
	size: number
	subtotal: number
	setCart: (items: CartItem[], id: string) => Promise<boolean>
	addItem: (pid: number, quantity: number) => Promise<boolean>
	updateItemQuantity: (id: number, quantity: number) => Promise<boolean>
	clearCart: () => Promise<void>
	deleteItem: (id: number) => Promise<void>
	getItems: (options?: GetItemOptions) => Promise<CartItem[]>
	getItem: (id: number, options?: GetItemOptions) => Promise<CartItem | undefined>
}

const CartContext = createContext<CartContextValue>({
	size: 0,
	subtotal: 0,
	setCart: async () => false,
	addItem: async () => false,
	updateItemQuantity: async () => false,
	clearCart: async () => {},
	deleteItem: async () => {},
	getItems: async () => [],
	getItem: async () => undefined,
})

const CartProvider: React.FunctionComponent<React.PropsWithChildren> = ({ children }) => {
	const cart = useProvideCart()
	return <CartContext.Provider value={cart}>{children}</CartContext.Provider>
}

const useCartContext = () => useContext(CartContext)

type CartState = {
	items: CartItem[]
	id: string
	size: number
	subtotal: number
}

type CartAction =
	| { type: 'SET_CART'; payload: { items: CartItem[]; id: string } }
	| { type: 'ADD_ITEM'; payload: CartItem }
	| { type: 'UPDATE_ITEM_QUANTITY'; payload: { id: number; linePrice: number; quantity: number } }
	| { type: 'DELETE_ITEM'; payload: { id: number } }
	| { type: 'CLEAR_CART' }

const initialCartState = { items: [], id: 'local', size: 0, subtotal: 0 }

const fetcher = (url: string) => fetch(url).then(res => res.json())

const cartReducer = (state: CartState, action: CartAction) => {
	switch (action.type) {
		case 'SET_CART':
			action.payload.items.forEach(item => {
				preload(`http://localhost:3000/api/products/${item.pid}`, fetcher)
			})

			return {
				items: action.payload.items,
				id: action.payload.id || state.id,
				size: action.payload.items.reduce((currentSize, item) => currentSize + item.quantity, 0),
				subtotal: action.payload.items.reduce(
					(currentTotal, item) => currentTotal + item.linePrice,
					0
				),
			}
		case 'ADD_ITEM':
			const newItem = action.payload
			preload(`http://localhost:3000/api/products/${newItem.pid}`, fetcher)

			return {
				...state,
				items: [...state.items, newItem],
				size: state.size + newItem.quantity,
				subtotal: state.subtotal + newItem.linePrice,
			}
		case 'UPDATE_ITEM_QUANTITY':
			return {
				...state,
				items: state.items.map(item => {
					if (item.id === action.payload.id) {
						return {
							...item,
							quantity: action.payload.quantity,
							linePrice: action.payload.linePrice,
						}
					}

					return item
				}),
				size: state.items.reduce((total, item) => {
					return total + (item.id === action.payload.id ? action.payload.quantity : item.quantity)
				}, 0),
				subtotal: state.items.reduce(
					(currentTotal, item) =>
						currentTotal +
						(item.id === action.payload.id ? action.payload.linePrice : item.linePrice),
					0
				),
			}
		case 'DELETE_ITEM':
			const itemToDelete = state.items.find(item => item.id === action.payload.id)
			if (itemToDelete === undefined) {
				return state
			}

			return {
				...state,
				items: state.items.filter((item: CartItem) => item.id !== itemToDelete.id),
				size: state.size - itemToDelete.quantity,
				subtotal: state.subtotal - itemToDelete.linePrice,
			}
		case 'CLEAR_CART':
			return initialCartState
	}
}

const useProvideCart = () => {
	const [cartState, dispatch] = useReducer(cartReducer, initialCartState)
	const [localCart, setLocalCart] = useState<LocalCart | undefined>(undefined)

	const addItemToLocalStorage = useCallback(
		async (product: Product, quantity: number): Promise<void> => {
			const newItem = makeCartItem(product, quantity)
			const storedCartItem = localCart?.add(newItem)

			if (storedCartItem) {
				dispatch({ type: 'ADD_ITEM', payload: storedCartItem })
			}
		},
		[localCart]
	)
	const addItemToDatabase = async (product: Product, quantity: number): Promise<void> => {}

	const updateItemQuantityInLocalStorage = useCallback(
		async (product: Product, item: CartItem, quantity: number): Promise<void> => {
			const updatedQuantity = quantity
			const updatedLinePrice = updatedQuantity * product.salePrice

			const {
				id,
				linePrice,
				quantity: qty,
			} = localCart?.update(item.id, {
				quantity: updatedQuantity,
				linePrice: updatedLinePrice,
			}) as CartItem

			if (id !== undefined && qty !== undefined) {
				dispatch({
					type: 'UPDATE_ITEM_QUANTITY',
					payload: { id, linePrice, quantity: qty },
				})
			}
		},
		[localCart]
	)
	const updateItemQuantityInDatabase = async (item: CartItem, quantity: number): Promise<void> => {}

	const deleteItemFromLocalStorage = useCallback(
		async (id: number): Promise<void> => {
			localCart?.delete(id)

			dispatch({ type: 'DELETE_ITEM', payload: { id } })
		},
		[localCart]
	)
	const deleteItemFromDatabase = () => {}

	const setCart = useCallback(async (items: CartItem[], id: string): Promise<boolean> => {
		// If user exists update cart on server
		// Otherwise update cart locally

		dispatch({ type: 'SET_CART', payload: { items, id } })

		return true
	}, [])

	const addItem = useCallback(
		async (pid: number, quantity: number): Promise<boolean> => {
			const product = await fetchProductById(pid)
			if (product === undefined) {
				return false
			}

			const existingItem = localCart?.getByProductId(product.id)

			if (existingItem) {
				if (existingItem.quantity === product.quantity) {
					return false
				}

				const newQuantity =
					existingItem.quantity + quantity < product.quantity
						? existingItem.quantity + quantity
						: product.quantity
				await updateItemQuantityInLocalStorage(product, existingItem, newQuantity)
			} else {
				const quantityToAdd = quantity <= product.quantity ? quantity : product.quantity
				await addItemToLocalStorage(product, quantityToAdd)
			}

			return true
		},
		[addItemToLocalStorage, localCart, updateItemQuantityInLocalStorage]
	)

	const updateItemQuantity = useCallback(
		async (id: number, quantity: number): Promise<boolean> => {
			const existingItem = localCart?.get(id)
			if (existingItem === undefined) {
				return false
			}

			const product = await fetchProductById(existingItem.pid)
			if (product === undefined) {
				return false
			}

			const isQuantityAvailable = quantity <= product.quantity
			const newQuantity = isQuantityAvailable ? quantity : product.quantity
			if (newQuantity === 0) {
				await deleteItemFromLocalStorage(id)
				return true
			}
			await updateItemQuantityInLocalStorage(product, existingItem, newQuantity)
			return true
		},
		[deleteItemFromLocalStorage, localCart, updateItemQuantityInLocalStorage]
	)

	const deleteItem = useCallback(
		async (id: number): Promise<void> => {
			await deleteItemFromLocalStorage(id)
		},
		[deleteItemFromLocalStorage]
	)

	const clearCart = useCallback(async (): Promise<void> => {
		localCart?.clear()
		dispatch({ type: 'CLEAR_CART' })
	}, [localCart])

	const getRefreshedItems = useCallback(async (): Promise<CartItem[]> => {
		const items: CartItem[] = []
		await Promise.all(
			cartState.items.map(async (item: CartItem) => {
				const product = await fetchProductById(item.pid)
				if (product) {
					const refreshedItem = {
						...item,
						...makeCartItem(product, item.quantity),
					}
					items.push(refreshedItem)
				} else {
					await deleteItem(item.id)
				}
			})
		)

		return items
	}, [cartState.items, deleteItem])

	const getRefreshedItem = useCallback(
		async (id: number): Promise<CartItem | undefined> => {
			const item = cartState.items.find(item => item.id === id)
			if (item === undefined) {
				return undefined
			}

			const product = await fetchProductById(id)
			if (product) {
				return {
					...item,
					...makeCartItem(product, item.quantity),
				}
			} else {
				await deleteItem(id)
				return undefined
			}
		},
		[cartState.items, deleteItem]
	)

	const getItems = useCallback(
		async (options?: GetItemOptions): Promise<CartItem[]> => {
			const items = options?.refresh ? await getRefreshedItems() : cartState.items
			return items.toSorted((a, b) => +new Date(a.createdAt) - +new Date(b.createdAt))
		},
		[getRefreshedItems, cartState.items]
	)

	const getItem = useCallback(
		async (id: number, options?: GetItemOptions): Promise<CartItem | undefined> => {
			return options?.refresh
				? await getRefreshedItem(id)
				: cartState.items.find(item => item.id === id)
		},
		[getRefreshedItem, cartState.items]
	)

	useEffect(() => {
		if (typeof window !== 'undefined' && localCart === undefined) {
			setLocalCart(new LocalCart())
		}
	}, [localCart])

	useEffect(() => {
		if (setCart && localCart) {
			setCart(JSON.parse(localStorage.getItem('cartItems') || '[]'), 'local')
		}
	}, [localCart, setCart])

	return {
		size: cartState.size,
		subtotal: cartState.subtotal,
		setCart,
		addItem,
		updateItemQuantity,
		deleteItem,
		getItems,
		getItem,
		clearCart,
	}
}

const fetchProductById = async (pid: number): Promise<Product | undefined> => {
	const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/products/${pid}`)
	return await res.json()
}

export { CartProvider, useCartContext, useProvideCart }
export type { CartContextValue, CartState }
