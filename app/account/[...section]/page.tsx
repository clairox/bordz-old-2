'use client'
import React from 'react'
import Addresses from '@/components/Account/Sections/Addresses'
import ChangePassword from '@/components/Account/Sections/ChangePassword'
import DeleteAccount from '@/components/Account/Sections/DeleteAccount'
import Orders from '@/components/Account/Sections/Orders'
import PersonalInfo from '@/components/Account/Sections/PersonalInfo'
import Settings from '@/components/Account/Sections/Settings'
import { useParams } from 'next/navigation'
import { useAccountContext } from '@/context/AccountContext/AccountContext'

const Page = () => {
	const section = useParams().section[0]

	const { loading } = useAccountContext()

	if (loading) {
		return <div>Loading...</div>
	}

	switch (section) {
		case 'settings':
			return <Settings />
		case 'orders':
			return <Orders />
		case 'personal-info':
			return <PersonalInfo />
		case 'addresses':
			return <Addresses />
		case 'change-password':
			return <ChangePassword />
		case 'delete-account':
			return <DeleteAccount />
		default:
			return <></>
	}
}

export default Page
