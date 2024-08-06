'use client'
import CartBase from '@/components/Cart/CartBase'
import CartLineItem from '../CartLineItem'
import { CartLine } from '@/types/store'

const MiniCart = () => {
	return (
		<CartBase>
			{(lineItems: CartLine[], subtotal: number) => (
				<div className="flex flex-col">
					{lineItems.map(item => {
						return (
							<CartLineItem
								key={item.id}
								cost={item.cost}
								lineId={item.id}
								merchandise={item.merchandise}
								quantity={item.quantity}
							/>
						)
					})}
					<div>
						<div>${subtotal.toFixed(2)}</div>
						<button>View Bag</button>
						<button>Checkout</button>
					</div>
				</div>
			)}
		</CartBase>
	)
}

export default MiniCart
