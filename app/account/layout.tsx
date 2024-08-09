import AccountSidebar from '@/components/Account/AccountSidebar'
import React from 'react'
import { AccountProvider } from '@/context/AccountContext/AccountContext'

const Layout = ({ children }: React.PropsWithChildren) => {
	return (
		<AccountProvider>
			<div className="grid grid-cols-12 w-[950px]">
				<aside className="col-span-3">
					<AccountSidebar />
				</aside>
				<main className="col-span-9 w-full">{children}</main>
			</div>
		</AccountProvider>
	)
}

export default Layout
