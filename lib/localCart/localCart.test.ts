import { LocalCart } from './localCart'
import type { UnsavedCartItem } from '@/types'

const item1: UnsavedCartItem = {
	pid: 1,
	name: 'Test Product',
	price: 100,
	salePrice: 90,
	imageUrl: 'test-url-1',
	quantity: 1,
}

const item2: UnsavedCartItem = {
	pid: 1,
	name: 'Test Product 2',
	price: 100,
	salePrice: 90,
	imageUrl: 'test-url-1',
	quantity: 1,
}

describe('local cart storage', () => {
	let testCart: LocalCart

	beforeEach(() => {
		testCart = new LocalCart('testCartItems')
	})

	afterEach(() => {
		testCart.clear()
	})

	it('should contain newly added single item', () => {
		const newItem = testCart.add(item1)
		expect(newItem).toEqual(
			expect.objectContaining({
				...item1,
				id: 1,
				cartId: 'local',
			})
		)
	})

	it('should contain all newly added items', () => {
		const newItems = testCart.addMany([item1, item2])

		expect(newItems).toEqual([
			expect.objectContaining({
				...item1,
				id: 1,
				cartId: 'local',
			}),
			expect.objectContaining({
				...item2,
				id: 2,
				cartId: 'local',
			}),
		])
	})

	it('should be able to retrieve an item by given product id', () => {
		const newItem = testCart.add(item1)

		if (newItem === undefined) {
			throw new Error('item not added successfully')
		}

		expect(testCart.get(newItem.pid)).toEqual(
			expect.objectContaining({
				...item1,
				id: 1,
				cartId: 'local',
			})
		)
	})

	it('should be able to retrieve all items', () => {
		const newItems = testCart.addMany([item1, item2])

		if (newItems.length !== 2) {
			throw new Error('items not added successfully')
		}

		expect(testCart.getAll()).toEqual([
			expect.objectContaining({
				...item1,
				id: 1,
				cartId: 'local',
			}),
			expect.objectContaining({
				...item2,
				id: 2,
				cartId: 'local',
			}),
		])
	})

	it('should contain item with updated values upon updating', () => {
		testCart.add(item1)
		const changes = testCart.update(1, { quantity: 100 }, false)
		expect(changes).toEqual({ quantity: 100 })
	})

	it('should not contain added item after deleting it', () => {
		const newItems = testCart.addMany([item1, item2])

		if (newItems.length !== 2) {
			throw new Error('items not added successfully')
		}

		testCart.delete(1)

		expect(testCart.getAll()).toEqual([
			expect.objectContaining({
				...item2,
				id: 2,
				cartId: 'local',
			}),
		])
	})

	it('should not exist after clearing', () => {
		testCart.add(item1)

		if (localStorage.getItem('testCartItems') === undefined) {
			throw new Error('item not added successfully')
		}

		testCart.clear()
		expect(localStorage.getItem('testCartItems')).toBe(null)
	})
})
