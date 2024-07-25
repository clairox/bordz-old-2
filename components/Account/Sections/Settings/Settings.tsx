import { Button } from '@/components/ui/Button'
import { Gear } from '@phosphor-icons/react/dist/ssr'
import Link from 'next/link'
import React from 'react'

const Settings: React.FunctionComponent<{
	firstName: string | null | undefined
	lastName: string | null | undefined
	email: string | null | undefined
	defaultAddress: any
}> = ({ firstName, lastName, email, defaultAddress }) => {
	return (
		<div>
			<div className="w-full">
				<h1 className="flex items-end gap-4 pl-5 pb-6 h-32 border-r border-b border-black text-4xl font-bold">
					<Gear size={40} weight="regular" />
					Settings
				</h1>
			</div>
			<div>
				<div className="px-8 py-5 w-full border-r border-b border-black">
					<div className="flex justify-between">
						<h2 className="inline-block float-left mb-6 font-semibold text-lg">Personal Details</h2>
						<Link href="/account/personal-info" className="inline-block float-right">
							Edit
						</Link>
					</div>
					<div>
						<p className="font-semibold">Email</p>
						<p className="mb-3">{email}</p>
						<p className="font-semibold">First name</p>
						<p className="mb-3">{firstName}</p>
						<p className="font-semibold">Last name</p>
						<p>{lastName}</p>
					</div>
				</div>
				<div className="px-8 py-5 w-full border-r border-b border-black">
					<div className="flex justify-between">
						<h2 className="inline-block float-left mb-6 font-semibold text-lg">Address</h2>
						<Link href="/account/addresses" className="inline-block float-right">
							Edit
						</Link>
					</div>
					{defaultAddress ? <p>Address</p> : <p>No home address saved.</p>}
				</div>
				<div className="px-8 py-5 w-full border-r border-b border-black">
					<h2 className="mb-6 font-semibold text-lg">Delete Account</h2>
					<Button>Delete Account</Button>
				</div>
			</div>
		</div>
	)
}

export default Settings
