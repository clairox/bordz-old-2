'use client'
import React, { useState } from 'react'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/Popover'
import MiniLoginForm from '@/components/Forms/MiniLoginForm'
import HeaderButton from '@/components/Header/HeaderAction'
import { User } from '@phosphor-icons/react/dist/ssr'
import { useAuth } from '@/context/AuthContext/AuthContext'

const AccountAction = () => {
	const { isLoggedIn, logout } = useAuth()
	const [open, setOpen] = useState(false)

	const handleLogout = async () => {
		const logoutSuccessful = await logout()
		if (logoutSuccessful) {
			window.location.href = '/'
		}
	}

	return (
		<Popover open={open} onOpenChange={setOpen}>
			<PopoverTrigger asChild>
				<HeaderButton triggered={open}>
					<User size={28} weight={open ? 'fill' : 'light'} />
				</HeaderButton>
			</PopoverTrigger>
			<PopoverContent alignOffset={-80} className="p-6 pt-4 border-t-0">
				{isLoggedIn ? <button onClick={handleLogout}>Logout</button> : <MiniLoginForm />}
			</PopoverContent>
		</Popover>
	)
}

export default AccountAction
