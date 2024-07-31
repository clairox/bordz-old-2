'use client'
import React from 'react'
import AccountSidebar from '../AccountSidebar'
import Settings from '../Sections/Settings'
import Orders from '../Sections/Orders'
import Addresses from '../Sections/Addresses'
import ChangePassword from '../Sections/ChangePassword'
import PersonalInfo from '../Sections/PersonalInfo'
import DeleteAccount from '../Sections/DeleteAccount'
import { AccountProvider } from '@/context/AccountContext/AccountContext'
import { GetCustomerQuery } from '@/__generated__/graphql'

const AccountRoot: React.FunctionComponent<{
	section: string
	customer: GetCustomerQuery['customer']
}> = ({ section, customer }) => {
	let content: React.ReactNode
	switch (section) {
		case 'settings':
			content = <Settings />
			break
		case 'orders':
			content = <Orders />
			break
		case 'personal-info':
			content = <PersonalInfo />
			break
		case 'addresses':
			content = <Addresses />
			break
		case 'change-password':
			content = <ChangePassword />
			break
		case 'delete-account':
			content = <DeleteAccount />
			break
		default:
			// TODO: 404
			break
	}

	return (
		<AccountProvider customer={customer}>
			<div className="grid grid-cols-12 w-[950px]">
				<aside className="col-span-3">
					<AccountSidebar />
				</aside>
				<main className="col-span-9 w-full">{content}</main>
			</div>
		</AccountProvider>
	)
}

export default AccountRoot
