import React from 'react'
import { Trash } from '@phosphor-icons/react'
import DeleteAccountForm from '@/components/Forms/DeleteAccountForm'

const DeleteAccount = () => {
	return (
		<div>
			<div className="w-full">
				<h1 className="flex items-end gap-4 pl-5 pb-6 h-32 border-r border-b border-black text-4xl font-bold">
					<Trash size={40} weight="regular" />
					Delete Account
				</h1>
			</div>
			<div className="w-[500px]">
				<DeleteAccountForm />
			</div>
		</div>
	)
}

export default DeleteAccount
