import React from 'react'
import { User } from '@phosphor-icons/react/dist/ssr'

const AccountButton = () => {
	return (
		<div className="flex justify-center items-center w-16 h-full border-l border-black">
			<button>
				<User size={28} weight="light" />
			</button>
		</div>
	)
}

export default AccountButton
