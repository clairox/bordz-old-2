'use client'
import React, { useEffect, useState, useCallback } from 'react'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/Popover'
import MiniLoginForm from '@/components/Forms/MiniLoginForm'
import HeaderButton from '@/components/Header/HeaderAction'
import { User } from '@phosphor-icons/react'
import { useAuth } from '@/context/AuthContext/AuthContext'
import AccountActionMenu from '@/components/Menu/AccountActionMenu'

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
		if (loadState === 'idle' || loadState === 'loading') {
			setPopoverContent(<>Loading...</>)
		}

		if (loadState === 'failed') {
			setPopoverContent(<MiniLoginForm closePopover={close} />)
		}

		if (loadState === 'succeeded' && user) {
			setPopoverContent(<AccountActionMenu user={user} handleLogout={handleLogout} />)
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
