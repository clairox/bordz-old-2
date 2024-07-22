import React, { PropsWithChildren } from 'react'
import AccountSidebar from '../AccountSidebar'

const AccountRoot: React.FunctionComponent<PropsWithChildren> = ({ children }) => {
	return (
		<div className="grid grid-cols-12">
			<aside className="col-span-3">
				<AccountSidebar />
			</aside>
			<main className="col-span-9 w-full">{children}</main>
		</div>
	)
}

export default AccountRoot
