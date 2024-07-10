import { act, renderHook } from '@testing-library/react'
import { useProvideCart } from '@/context/cartContext'
import { makeCartItem, makeFullCartItem } from '@/lib/cartUtils'
import type { CartItem } from '@/types'

beforeAll(async () => {
	global.fetch = vi.fn((path: string) => {
		if (path === 'http://localhost:3000/api/products/1') {
			return Promise.resolve({
				json: () => Promise.resolve(product1),
			})
		} else if (path === 'http://localhost:3000/api/products/2') {
			return Promise.resolve({
				json: () => Promise.resolve(product2),
			})
		}
	}) as any
})

const product1 = {
	id: 1,
	name: 'Test Product',
	handle: 'test-product',
	price: 100,
	salePrice: 90,
	imageUrls: ['test-url-1', 'test-url-2'],
	size: '8.5"',
	color: 'Test Color',
	description: 'test description',
	details: ['test detail 1', 'test detail 2'],
	quantity: 10,
	brand: 'Test Brand',
	createdAt: new Date(),
}

const product2 = {
	id: 2,
	name: 'Test Product',
	handle: 'test-product',
	price: 100,
	salePrice: 90,
	imageUrls: ['test-url-1', 'test-url-2'],
	size: '8.5"',
	color: 'Test Color',
	description: 'test description',
	details: ['test detail 1', 'test detail 2'],
	quantity: 10,
	brand: 'Test Brand',
	createdAt: new Date(),
}

const item1 = makeFullCartItem(1, product1, 5, 'local')
const item2 = makeFullCartItem(2, product2, 9, 'local')

type UseProvideCartRenderResult = {
	current: {
		setCart: (items: CartItem[], id: string) => Promise<boolean>
		addItem: (pid: number, quantity: number) => Promise<boolean>
		updateItemQuantity: (id: number, quantity: number) => Promise<boolean>
		clearCart: () => Promise<void>
		deleteItem: (id: number) => Promise<void>
		getItems: () => Promise<CartItem[]>
	}
}

const setCart = async (
	renderResult: UseProvideCartRenderResult,
	items: CartItem[],
	id: string
): Promise<boolean> => await act(async () => await renderResult.current.setCart(items, id))

const addItem = async (
	renderResult: UseProvideCartRenderResult,
	pid: number,
	quantity: number
): Promise<boolean> => await act(async () => await renderResult.current.addItem(pid, quantity))

const updateItemQuantity = async (
	renderResult: UseProvideCartRenderResult,
	id: number,
	quantity: number
): Promise<boolean> =>
	await act(async () => await renderResult.current.updateItemQuantity(id, quantity))

const clearCart = async (renderResult: UseProvideCartRenderResult): Promise<void> =>
	await act(async () => await renderResult.current.clearCart())

const deleteItem = async (renderResult: UseProvideCartRenderResult, id: number): Promise<void> =>
	await act(async () => await renderResult.current.deleteItem(id))

const getItems = async (renderResult: UseProvideCartRenderResult): Promise<CartItem[]> =>
	await act(async () => await renderResult.current.getItems())

describe('setItems function', () => {
	it('should add all given items', async () => {
		const { result } = renderHook(() => useProvideCart())

		await setCart(result, [item1, item2], 'local')
		const items = await getItems(result)

		expect(items).toEqual([
			expect.objectContaining({ pid: 1, quantity: 5 }),
			expect.objectContaining({ pid: 2, quantity: 9 }),
		])

		await clearCart(result)
	})
})

describe('addItem function', () => {
	it('should add given item to cart', async () => {
		const { result } = renderHook(() => useProvideCart())
		const productId = 1

		const addSuccessful = await addItem(result, productId, 2)
		expect(addSuccessful).toBe(true)

		const items = await getItems(result)
		expect(items.find(item => item.pid === productId)).toEqual(
			expect.objectContaining({ quantity: 2 })
		)

		await clearCart(result)
	})

	it('should not add more than product quantity', async () => {
		const { result } = renderHook(() => useProvideCart())
		const productId = 1

		await addItem(result, productId, 15)
		const items = await getItems(result)

		expect(items.find(item => item.pid === productId)!.quantity).toBe(10)

		await clearCart(result)
	})

	it('should not add more than the difference between product quantity and existing cart item quantity', async () => {
		const { result } = renderHook(() => useProvideCart())
		const productId = 1

		await addItem(result, productId, 7)
		await addItem(result, productId, 5)
		const items = await getItems(result)

		expect(items.find(item => item.pid === productId)!.quantity).toBe(10)

		await clearCart(result)
	})

	it('should not add to existing cart item quantity if equal to product quantity', async () => {
		const { result } = renderHook(() => useProvideCart())
		const productId = 1

		await addItem(result, productId, 10)
		const success = await addItem(result, productId, 5)
		expect(success).toBe(false)

		await clearCart(result)
	})

	it('should update quantity when re-adding existing cart item', async () => {
		const { result } = renderHook(() => useProvideCart())

		const productId = 1

		await addItem(result, productId, 2)
		await addItem(result, productId, 5)
		const items = await getItems(result)

		expect(items.find(item => item.pid === productId)).toEqual(
			expect.objectContaining({ quantity: 7 })
		)

		await clearCart(result)
	})
})

describe('updateItemQuantity function', () => {
	it('should update quantity of item with given id', async () => {
		const { result } = renderHook(() => useProvideCart())

		const productId = 1

		const addSuccessful = await addItem(result, productId, 5)
		expect(addSuccessful).toBe(true)

		let items = await getItems(result)
		const updateSuccessful = await act(async () => {
			const item = items.find(item => item.pid === productId)
			if (item) {
				return await result.current.updateItemQuantity(item.id, 2)
			}
		})
		expect(updateSuccessful).toBe(true)

		items = await getItems(result)
		expect(items.find(item => item.pid === productId)).toEqual(
			expect.objectContaining({ quantity: 2 })
		)

		await clearCart(result)
	})

	it('should delete item from cart if called with quantity of 0', async () => {
		const { result } = renderHook(() => useProvideCart())
		const productId = 1

		await addItem(result, productId, 2)
		let items = await getItems(result)
		const addedItem = items.find(item => item.pid === productId)!
		await updateItemQuantity(result, addedItem.id, 0)
		items = await getItems(result)

		expect(items.find(item => item.id === addedItem.id)).toEqual(undefined)
		await clearCart(result)
	})
})

describe('clearCart function', () => {
	it('should clear cart', async () => {
		const { result } = renderHook(() => useProvideCart())

		const productId = 1

		await addItem(result, productId, 2)

		await clearCart(result)
		const items = await getItems(result)
		expect(items).toEqual([])

		await clearCart(result)
	})
})

describe('deleteItem function', () => {
	it('should delete item with given id', async () => {
		const { result } = renderHook(() => useProvideCart())
		const productId = 1

		await addItem(result, productId, 2)

		let items = await getItems(result)
		const id = items.find(item => item.pid === productId)!.id
		await deleteItem(result, id)

		items = await getItems(result)
		expect(items.find(item => item.id === id)).toEqual(undefined)

		await clearCart(result)
	})
})

describe('getItems function', () => {
	it('should retrieve all items in cart', async () => {
		const { result } = renderHook(() => useProvideCart())

		await setCart(result, [item1, item2], 'local')
		const items = await getItems(result)

		expect(items).toEqual([
			expect.objectContaining({ pid: 1, quantity: 5 }),
			expect.objectContaining({ pid: 2, quantity: 9 }),
		])

		await clearCart(result)
	})

	it('should retrieve cart items sorted oldest to newest', () => {})
})

describe('cart size', () => {
	it('should equal the quantities of all cart items added together', async () => {
		const { result } = renderHook(() => useProvideCart())

		await setCart(result, [item1, item2], 'local')
		expect(result.current.size).toBe(14)

		await clearCart(result)
	})
	it('should increase by quantity when adding new cart item', async () => {
		const { result } = renderHook(() => useProvideCart())
		await addItem(result, 1, 2)
		expect(result.current.size).toBe(2)

		await addItem(result, 2, 3)
		expect(result.current.size).toBe(5)

		await clearCart(result)
	})

	it('should increase by quantity when adding existing cart item', async () => {
		const { result } = renderHook(() => useProvideCart())
		await addItem(result, 1, 2)
		expect(result.current.size).toBe(2)

		await addItem(result, 1, 3)
		expect(result.current.size).toBe(5)

		await clearCart(result)
	})

	it('should equal quantity set when updating cart item quantity', async () => {
		const { result } = renderHook(() => useProvideCart())
		const productId = 1

		await addItem(result, productId, 4)
		expect(result.current.size).toBe(4)

		const items = await getItems(result)
		const addedItem = items.find(item => item.pid === productId)!
		await updateItemQuantity(result, addedItem.id, 1)
		expect(result.current.size).toBe(1)

		await clearCart(result)
	})

	it('should decrease by quantity of cart item upon deleting', async () => {
		const { result } = renderHook(() => useProvideCart())
		const productId1 = 1
		const productId2 = 2

		await addItem(result, productId1, 2)
		expect(result.current.size).toBe(2)

		await addItem(result, productId2, 6)
		expect(result.current.size).toBe(8)

		const items = await getItems(result)
		const addedItem = items.find(item => item.pid === productId1)!
		await deleteItem(result, addedItem.id)
		expect(result.current.size).toBe(6)

		await clearCart(result)
	})

	it('should be set to zero after clearing cart', async () => {
		const { result } = renderHook(() => useProvideCart())

		await setCart(result, [item1, item2], 'local')
		expect(result.current.size).toBe(14)

		await clearCart(result)
		expect(result.current.size).toBe(0)

		await clearCart(result)
	})
})
