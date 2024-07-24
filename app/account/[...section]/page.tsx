import AccountRoot from '@/components/Account/AccountRoot'
import { isAuthenticated } from '@/lib/utils/ssr'
import { redirect } from 'next/navigation'
import React from 'react'

const Page: React.FunctionComponent<{ params: { section: string[] } }> = ({ params }) => {
	if (!isAuthenticated()) {
		redirect('/login')
	}

	const [sectionParam] = params.section
	console.log(params)

	return <AccountRoot section={sectionParam} />
}

export default Page
