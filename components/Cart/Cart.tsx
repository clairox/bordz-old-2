'use client'
import { useCartContext } from '@/context/CartContext/CartContext'
import type { CartItem } from '@/types'
import { X } from '@phosphor-icons/react'
import Image from 'next/image'
import React, { useEffect, useState } from 'react'
import useSWR, { mutate } from 'swr'
import Counter from '@/components/Counter'

const CartBase: React.FunctionComponent<{
	children: (items: CartItem[], subtotal: number) => React.ReactNode
}> = ({ children }) => {
	const { subtotal, getItems } = useCartContext()
	const [items, setItems] = useState<CartItem[]>([])
	const [firstLoad, setFirstLoad] = useState(true)

	useEffect(() => {
		getItems({ refresh: firstLoad ? true : false }).then((result: CartItem[]) => {
			setFirstLoad(false)
			setItems(result)
		})
	}, [getItems, firstLoad])

	if (items.length > 0) {
		return <div>{children(items, subtotal)}</div>
	}

	return <></>
}

const CartItemList: React.FunctionComponent<{ items: CartItem[] }> = ({ items }) => {
	const { deleteItem, updateItemQuantity } = useCartContext()
	return (
		<div>
			{items.map(item => (
				<CartItem key={item.id} cartItem={item} {...{ deleteItem, updateItemQuantity }} />
			))}
		</div>
	)
}

const fetcher = (url: string) => fetch(url).then(res => res.json())

const CartItem: React.FunctionComponent<{
	cartItem: CartItem
	deleteItem: (id: number) => void
	updateItemQuantity: (id: number, quantity: number) => Promise<boolean>
}> = ({ cartItem, deleteItem, updateItemQuantity }) => {
	const { data: product } = useSWR(`http://localhost:3000/api/products/${cartItem.pid}`, fetcher)
	const [quantity, setQuantity] = useState<number | ''>(cartItem.quantity)

	useEffect(() => {
		setQuantity(cartItem.quantity)
	}, [cartItem.quantity])

	const setCartQuantity = async (amount: number | '') => {
		updateItemQuantity(cartItem.id, +amount)
	}

	const handleCounterDecrement = () => {
		if (+quantity - 1 < 0) {
			return handleDelete()
		}
		setCartQuantity(cartItem.quantity - 1)
	}

	const handleCounterIncrement = () => {
		if (+quantity + 1 > product.quantity) {
			return
		}
		setCartQuantity(cartItem.quantity + 1)
	}

	const handleCounterChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		if (event.target.value === '') {
			return setQuantity(event.target.value)
		}

		const newValue = +event.target.value

		console.log(newValue)
		if (isNaN(newValue)) {
			return
		}

		if (newValue < 0) {
			return setQuantity(0)
		} else if (newValue > product.quantity) {
			return setQuantity(product.quantity)
		}

		return setQuantity(newValue)
	}

	const handleCounterBlur = (event: React.FocusEvent<HTMLInputElement>) => {
		if (quantity === '') {
			return setCartQuantity(1)
		}

		if (quantity <= 0) {
			return handleDelete()
		}

		setCartQuantity(Math.min(+quantity, product.quantity))
	}

	const handleDelete = () => {
		mutate(`http://localhost:3000/api/products/${cartItem.pid}`, undefined, false)
		deleteItem(cartItem.id)
	}

	if (product) {
		return (
			<article className="flex">
				<div className="cart-item-left">
					<Image src={product.imageUrls[0]} alt="product image" width="177" height="210" />
				</div>
				<div className="cart-item-right flex flex-col">
					<div className="flex justify-between">
						<h1>{product.name}</h1>
						<button onClick={handleDelete}>
							<X size={20} weight="regular" />
						</button>
					</div>
					<div className="flex justify-between">
						<p>
							Size: <span>{product.size}</span>
						</p>
						<Counter
							value={quantity}
							setValue={setCartQuantity}
							minValue={0}
							maxValue={product.quantity}
							decrement={handleCounterDecrement}
							increment={handleCounterIncrement}
							onChange={handleCounterChange}
							onBlur={handleCounterBlur}
						/>
					</div>
					<div>
						<p>${(cartItem.linePrice * 0.01).toFixed(2)}</p>
					</div>
				</div>
			</article>
		)
	}

	return <></>
}

export { CartBase, CartItemList }
