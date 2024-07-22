'use client'
import React, { useEffect, useState, useCallback } from 'react'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/Popover'
import MiniLoginForm from '@/components/Forms/MiniLoginForm'
import HeaderButton from '@/components/Header/HeaderAction'
import { User } from '@phosphor-icons/react/dist/ssr'
import { useAuth } from '@/context/AuthContext/AuthContext'

const AccountAction = () => {
	const { loadState, logout } = useAuth()
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
				setPopoverContent(<button onClick={handleLogout}>Logout</button>)
				break
			case 'failed':
				setPopoverContent(<MiniLoginForm closePopover={close} />)
				break
			default:
				setPopoverContent(<MiniLoginForm closePopover={close} />)
				break
		}
	}, [loadState, handleLogout])

	return (
		<Popover open={open} onOpenChange={setOpen}>
			<PopoverTrigger asChild>
				<HeaderButton triggered={open}>
					<User size={28} weight={open ? 'fill' : 'light'} />
				</HeaderButton>
			</PopoverTrigger>
			<PopoverContent alignOffset={-80} className="p-6 pt-4 w-[300px] border-t-0">
				{popoverContent}
			</PopoverContent>
		</Popover>
	)
}

export default AccountAction
