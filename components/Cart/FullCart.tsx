'use client'
import { CartBase, CartItemList } from './Cart'

const FullCart = () => {
	return (
		<CartBase>
			{(items, subtotal) => (
				<div className="flex flex-row">
					<CartItemList items={items} />
					<div>
						<div>${(subtotal * 0.01).toFixed(2)}</div>
						<button>Checkout</button>
					</div>
				</div>
			)}
		</CartBase>
	)
}

export default FullCart
