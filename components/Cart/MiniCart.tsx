'use client'
import { CartBase, CartItemList } from './Cart'

const MiniCart = () => {
	return (
		<CartBase>
			{(items, subtotal) => (
				<div className="flex flex-col">
					<CartItemList items={items} />
					<div>
						<div>${(subtotal * 0.01).toFixed(2)}</div>
						<button>View Bag</button>
						<button>Checkout</button>
					</div>
				</div>
			)}
		</CartBase>
	)
}

export default MiniCart
