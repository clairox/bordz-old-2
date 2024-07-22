import React from 'react'
import AccountRoot from '@/components/Account/AccountRoot'
import { House } from '@phosphor-icons/react/dist/ssr'

const Page = () => {
	return (
		<AccountRoot>
			<div className="w-full">
				<h1 className="flex items-end gap-4 pl-5 pb-6 h-32 border-r border-b border-black text-4xl font-bold">
					<House size={40} weight="bold" />
					Shipping Addresses
				</h1>
			</div>
			<div className="w-[500px]">Hello</div>
		</AccountRoot>
	)
}

export default Page
