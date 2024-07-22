'use client'
import { User } from '@/context/AuthContext/AuthContext'
import { User as UserIcon, Package, SignOut } from '@phosphor-icons/react'
import Link from 'next/link'
import React from 'react'

const AccountActionMenu: React.FunctionComponent<{
	user: User
	handleLogout: () => Promise<void>
}> = ({ user, handleLogout }) => {
	return (
		<div>
			<h1 className="px-5 pb-4 pt-2 font-semibold text-xl">Hey, {user.firstName}!</h1>
			<Link
				href="/account/settings"
				className="flex items-center gap-3 px-5 h-16 border-t border-black cursor-pointer hover:bg-gray-100"
			>
				<UserIcon size={27} weight={'light'} />
				My Account
			</Link>
			<Link
				href="/account/orders"
				className="flex items-center gap-3 px-5 h-16 border-t border-black cursor-pointer hover:bg-gray-100"
			>
				<Package size={27} weight={'light'} />
				Orders
			</Link>
			<button
				className="flex items-center gap-3 px-5 w-full h-16 border-t border-black cursor-pointer hover:bg-gray-100"
				onClick={handleLogout}
			>
				<SignOut size={27} weight={'light'} />
				Logout
			</button>
		</div>
	)
}

export default AccountActionMenu
