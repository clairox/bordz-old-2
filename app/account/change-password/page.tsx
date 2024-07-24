import React from 'react'
import AccountRoot from '@/components/Account/AccountRoot'
import { Lock } from '@phosphor-icons/react/dist/ssr'
import ChangePasswordForm from '@/components/Forms/ChangePasswordForm'

const Page = () => {
	return (
		<AccountRoot>
			<div className="w-full">
				<h1 className="flex items-end gap-4 pl-5 pb-6 h-32 border-r border-b border-black text-4xl font-bold">
					<Lock size={40} weight="bold" />
					Change Password
				</h1>
			</div>
			<div className="w-[500px]">
				<ChangePasswordForm />
			</div>
		</AccountRoot>
	)
}

export default Page
