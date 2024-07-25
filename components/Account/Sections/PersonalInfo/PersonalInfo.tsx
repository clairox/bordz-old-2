import React from 'react'
import { User } from '@phosphor-icons/react/dist/ssr'
import PersonalInfoForm from '@/components/Forms/PersonalInfoForm'

const PersonalInfo: React.FunctionComponent<{
	firstName: string | null | undefined
	lastName: string | null | undefined
	email: string | null | undefined
}> = ({ firstName, lastName, email }) => {
	return (
		<div>
			<div className="w-full">
				<h1 className="flex items-end gap-4 pl-5 pb-6 h-32 border-r border-b border-black text-4xl font-bold">
					<User size={40} weight="regular" />
					Personal Info
				</h1>
			</div>
			<div className="w-[500px]">
				<PersonalInfoForm firstName={firstName} lastName={lastName} email={email} />
			</div>
		</div>
	)
}

export default PersonalInfo
