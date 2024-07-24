import React, { PropsWithChildren } from 'react'
import AccountSidebar from '../AccountSidebar'
import { redirect } from 'next/navigation'
import { isAuthenticated } from '@/lib/utils/ssr'

const AccountRoot: React.FunctionComponent<PropsWithChildren> = ({ children }) => {
	if (!isAuthenticated()) {
		redirect('/login')
	}

	return (
		<div className="grid grid-cols-12 w-[950px]">
			<aside className="col-span-3">
				<AccountSidebar />
			</aside>
			<main className="col-span-9 w-full">{children}</main>
		</div>
	)
}

export default AccountRoot
