import AccountRoot from '@/components/Account/AccountRoot'
import { getClient } from '@/lib/apollo/apolloClient'
import { GET_CUSTOMER } from '@/lib/queries'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import React from 'react'

const Page: React.FunctionComponent<{ params: { section: string[] } }> = async ({ params }) => {
	const customerAccessToken = cookies().get('customerAccessToken')
	if (!customerAccessToken) {
		redirect('/login')
	}

	const { data, error } = await getClient().query({
		query: GET_CUSTOMER,
		variables: { customerAccessToken: customerAccessToken.value },
	})

	if (error) {
		console.error(error.message)
		return <></>
	}

	if (data.customer === undefined) {
		redirect('/login')
	}

	const [sectionParam] = params.section
	return <AccountRoot section={sectionParam} customer={data.customer} />
}

export default Page
