import type { CartItem, UnsavedCartItem } from '@/types'

type ILocalCart = {
	add(item: CartItem): CartItem | undefined
	addMany(items: CartItem[]): CartItem[]
	get(id: number): CartItem | undefined
	getByProductId(pid: number): CartItem | undefined
	getAll(): CartItem[]
	update(
		id: number,
		changes: Partial<CartItem>,
		returnFullObject: boolean
	): CartItem | Partial<CartItem> | undefined
	delete(id: number): void
	clear(): void
}

class LocalCart implements ILocalCart {
	private name: string
	private lastId: number = 0

	constructor(propName?: string) {
		this.name = propName || 'cartItems'
		this.getAll().forEach(item => {
			if (item.id > this.lastId) {
				this.lastId = item.id
			}
		})
	}

	add(item: UnsavedCartItem): CartItem | undefined {
		const id = this.lastId + 1
		store(this.name, {
			id,
			...item,
			cartId: 'local',
			createdAt: new Date(),
		})

		++this.lastId
		return this.get(id)
	}

	addMany(items: UnsavedCartItem[]): CartItem[] {
		const addedItems: CartItem[] = []
		items.forEach(item => {
			const newItem = this.add(item)

			if (newItem) {
				addedItems.push(newItem)
			}
		})

		return addedItems
	}

	get(id: number): CartItem | undefined {
		return retrieve(this.name, 'id', id)
	}

	getByProductId(pid: number): CartItem | undefined {
		return retrieve(this.name, 'pid', pid)
	}

	getAll(): CartItem[] {
		return retrieveAll(this.name)
	}

	update(
		id: number,
		changes: Partial<CartItem>,
		returnFullObject = true
	): CartItem | Partial<CartItem> | undefined {
		const item = retrieve(this.name, 'id', id) as CartItem
		remove(this.name, 'id', id)

		store(this.name, {
			...item,
			...changes,
		})

		const updatedItem = this.get(id)

		if (returnFullObject || updatedItem === undefined) {
			return updatedItem
		}

		for (let i = 0; i < Object.keys(changes).length; i++) {
			const change = Object.keys(changes)[i]
			if (updatedItem[change as keyof CartItem] !== changes[change as keyof CartItem]) {
				return undefined
			}
		}

		return changes
	}

	delete(id: number): void {
		remove(this.name, 'id', id)
	}

	clear(): void {
		removeAll(this.name)
	}
}

function serialize<T>(data: T): string {
	return JSON.stringify(data)
}

function deserialize<T>(rawData: string): T[] {
	return JSON.parse(rawData)
}

function store<T>(propName: string, item: T): void {
	const items = retrieveAll(propName) as T[]
	items.push(item)

	localStorage.setItem(propName, serialize(items))
}

function retrieve<T>(propName: string, key: keyof T, keyValue: any): T | undefined {
	const rawData = localStorage.getItem(propName) || '[]'
	const items = deserialize(rawData) as T[]

	return items.find(item => item[key] === keyValue)
}

function retrieveAll<T>(propName: string): T[] {
	const rawData = localStorage.getItem(propName) || '[]'
	return deserialize(rawData)
}

function remove<T>(propName: string, key: keyof T, keyValue: any): void {
	const items = retrieveAll(propName) as T[]
	const updatedItems = items.filter(item => item[key] !== keyValue)

	localStorage.setItem(propName, serialize(updatedItems))
}

function removeAll<T>(propName: string): void {
	localStorage.removeItem(propName)
}

export { LocalCart }
