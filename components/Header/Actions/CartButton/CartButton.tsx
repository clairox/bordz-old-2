import React from 'react'
import { Bag } from '@phosphor-icons/react/dist/ssr'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/Sheet'
import MiniCart from '@/components/Cart/MiniCart'

const CartButton = () => {
	return (
		<Sheet>
			<SheetTrigger asChild>
				<div className="flex justify-center items-center w-16 h-full border-l border-b border-black cursor-pointer">
					<button>
						<Bag size={28} weight="light" />
					</button>
				</div>
			</SheetTrigger>
			<CartSheet />
		</Sheet>
	)
}

const CartSheet = () => {
	return (
		<SheetContent>
			<SheetHeader>
				<SheetTitle>Your Bag</SheetTitle>
			</SheetHeader>
		</SheetContent>
	)
}

export default CartButton
