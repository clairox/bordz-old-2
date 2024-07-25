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

	const { data, errors } = await getClient().query({
		query: GET_CUSTOMER,
		variables: { customerAccessToken: customerAccessToken.value },
	})

	if (errors) {
		console.error(errors)
		return <>Error</>
	}

	const [sectionParam] = params.section

	return <AccountRoot section={sectionParam} customer={data.customer} />
}

export default Page
