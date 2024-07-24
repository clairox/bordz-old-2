'use client'
import React from 'react'
import AccountSidebar from '../AccountSidebar'
import Settings from '../Sections/Settings'
import Orders from '../Sections/Orders'
import Addresses from '../Sections/Addresses'
import ChangePassword from '../Sections/ChangePassword'

const AccountRoot: React.FunctionComponent<{ section: string }> = ({ section }) => {
	console.log(section)

	let content = <></>
	switch (section) {
		case 'settings':
			content = <Settings />
			break
		case 'orders':
			content = <Orders />
			break
		case 'addresses':
			content = <Addresses />
			break
		case 'change-password':
			content = <ChangePassword />
			break
		default:
			// TODO: 404
			break
	}

	return (
		<div className="grid grid-cols-12 w-[950px]">
			<aside className="col-span-3">
				<AccountSidebar />
			</aside>
			<main className="col-span-9 w-full">{content}</main>
		</div>
	)
}

export default AccountRoot
