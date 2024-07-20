'use client'
import React, { useState } from 'react'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/Popover'
import MiniLoginForm from '@/components/Forms/MiniLoginForm'
import HeaderButton from '@/components/Header/HeaderAction'
import { User } from '@phosphor-icons/react/dist/ssr'

const AccountAction = () => {
	const [open, setOpen] = useState(false)
	return (
		<Popover open={open} onOpenChange={setOpen}>
			<PopoverTrigger asChild>
				<HeaderButton triggered={open}>
					<User size={28} weight={open ? 'fill' : 'light'} />
				</HeaderButton>
			</PopoverTrigger>
			<PopoverContent alignOffset={-80} className="pt-3 border-t-0">
				<MiniLoginForm />
			</PopoverContent>
		</Popover>
	)
}

export default AccountAction
