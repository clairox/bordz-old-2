'use client'
import React, { useEffect, useState, useCallback } from 'react'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/Popover'
import MiniLoginForm from '@/components/Forms/MiniLoginForm'
import HeaderButton from '@/components/Header/HeaderAction'
import { User } from '@phosphor-icons/react/dist/ssr'
import { useAuth } from '@/context/AuthContext/AuthContext'
import Link from 'next/link'
import { Package, SignOut } from '@phosphor-icons/react'

const AccountAction = () => {
	const { loadState, user, logout } = useAuth()
	const [open, setOpen] = useState(false)
	const [popoverContent, setPopoverContent] = useState(<>Loading...</>)

	const handleLogout = useCallback(async () => {
		const logoutSuccessful = await logout()
		if (logoutSuccessful) {
			window.location.href = '/'
		}
	}, [logout])

	const close = () => setOpen(false)

	useEffect(() => {
		switch (loadState) {
			case 'idle':
				setPopoverContent(<>Loading...</>)
				break
			case 'loading':
				setPopoverContent(<>Loading...</>)
				break
			case 'succeeded':
				setPopoverContent(
					<div>
						<h1 className="px-4 pb-4 pt-2 font-semibold text-xl">Hello, {user?.firstName}!</h1>
						<Link
							href="/account/settings"
							className="flex items-center gap-3 px-4 h-16 border-t border-black cursor-pointer hover:bg-gray-100"
						>
							<User size={27} weight={'light'} />
							My Account
						</Link>
						<Link
							href="/account/orders"
							className="flex items-center gap-3 px-4 h-16 border-t border-black cursor-pointer hover:bg-gray-100"
						>
							<Package size={27} weight={'light'} />
							Orders
						</Link>
						<button
							className="flex items-center gap-3 px-4 w-full h-16 border-t border-black cursor-pointer hover:bg-gray-100"
							onClick={handleLogout}
						>
							<SignOut size={27} weight={'light'} />
							Logout
						</button>
					</div>
				)
				break
			case 'failed':
				setPopoverContent(<MiniLoginForm closePopover={close} />)
				break
			default:
				setPopoverContent(<MiniLoginForm closePopover={close} />)
				break
		}
	}, [loadState, user, handleLogout])

	return (
		<Popover open={open} onOpenChange={setOpen}>
			<PopoverTrigger asChild>
				<HeaderButton triggered={open}>
					<User size={28} weight={open ? 'fill' : 'light'} />
				</HeaderButton>
			</PopoverTrigger>
			<PopoverContent alignOffset={-80} className="p-0 pt-4 w-[300px] border-t-0">
				{popoverContent}
			</PopoverContent>
		</Popover>
	)
}

export default AccountAction
