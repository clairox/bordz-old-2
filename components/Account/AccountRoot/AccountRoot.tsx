'use client'
import React from 'react'
import AccountSidebar from '../AccountSidebar'
import Settings from '../Sections/Settings'
import Orders from '../Sections/Orders'
import Addresses from '../Sections/Addresses'
import ChangePassword from '../Sections/ChangePassword'
import PersonalInfo from '../Sections/PersonalInfo'
import DeleteAccount from '../Sections/DeleteAccount'

const AccountRoot: React.FunctionComponent<{
	section: string
	customer: any
}> = ({ section, customer }) => {
	if (!customer) {
		// TODO: error stuff
		return <>Error</>
	}

	let content: React.ReactNode
	switch (section) {
		case 'settings':
			content = (
				<Settings
					firstName={customer.firstName}
					lastName={customer.lastName}
					email={customer.email}
					defaultAddress={customer.defaultAddress}
				/>
			)
			break
		case 'orders':
			content = <Orders />
			break
		case 'personal-info':
			content = (
				<PersonalInfo
					firstName={customer.firstName}
					lastName={customer.lastName}
					email={customer.email}
				/>
			)
			break
		case 'addresses':
			content = <Addresses />
			break
		case 'change-password':
			content = <ChangePassword />
			break
		case 'delete-account':
			content = <DeleteAccount customerEmail={customer.email} />
			break
		default:
			// TODO: 404
			break
	}

	return (
		<div className="grid grid-cols-12 w-[950px]">
			<aside className="col-span-3">
				<AccountSidebar customerFirstName={customer?.firstName} />
			</aside>
			<main className="col-span-9 w-full">{content}</main>
		</div>
	)
}

export default AccountRoot
