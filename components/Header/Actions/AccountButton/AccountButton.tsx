'use client'
import React, { useState } from 'react'
import { User } from '@phosphor-icons/react/dist/ssr'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/Popover'
import MiniLoginForm from '@/components/Forms/MiniLoginForm'

const AccountButton = () => {
	const [open, setOpen] = useState(false)
	return (
		<Popover open={open} onOpenChange={setOpen}>
			<PopoverTrigger asChild>
				<div
					className={`flex justify-center items-center w-16 h-full border-l border-black cursor-pointer ${
						open ? '' : 'border-b'
					}`}
				>
					<button>
						<User size={28} weight={open ? 'fill' : 'light'} />
					</button>
				</div>
			</PopoverTrigger>
			<PopoverContent alignOffset={-80} className="pt-3 border-t-0">
				<MiniLoginForm />
			</PopoverContent>
		</Popover>
	)
}

export default AccountButton
