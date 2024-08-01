'use client'
import React, { useState } from 'react'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/Popover'
import HeaderButton from '@/components/Header/HeaderAction'
import { BagSimple } from '@phosphor-icons/react/dist/ssr'

const CartAction = () => {
	const [open, setOpen] = useState(false)
	return (
		<Popover open={open} onOpenChange={setOpen}>
			<PopoverTrigger asChild>
				<HeaderButton triggered={open}>
					<BagSimple size={28} weight={open ? 'fill' : 'light'} />
				</HeaderButton>
			</PopoverTrigger>
			<PopoverContent className="pt-3 border-t-0 border-r-0"></PopoverContent>
		</Popover>
	)
}

export default CartAction
