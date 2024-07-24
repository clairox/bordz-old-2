'use client'
import ChangePasswordForm from '@/components/Forms/ChangePasswordForm'
import { Lock } from '@phosphor-icons/react'
import React from 'react'

const ChangePassword = () => {
	return (
		<div>
			<div className="w-full">
				<h1 className="flex items-end gap-4 pl-5 pb-6 h-32 border-r border-b border-black text-4xl font-bold">
					<Lock size={40} weight="bold" />
					Change Password
				</h1>
			</div>
			<div className="w-[500px]">
				<ChangePasswordForm />
			</div>
		</div>
	)
}

export default ChangePassword
