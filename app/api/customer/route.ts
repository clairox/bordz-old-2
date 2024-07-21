import { getClient } from '@/lib/apollo/apolloClient'
import { GET_CUSTOMER } from '@/lib/queries'
import { NextRequest, NextResponse } from 'next/server'

export const GET = async (request: NextRequest) => {
	const customerAccessToken = request.cookies.get('customerAccessToken')
	if (!customerAccessToken) {
		return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
	}

	const { data: getCustomerResponseData, errors: getCustomersResponseErrors } =
		await getClient().query({
			query: GET_CUSTOMER,
			variables: { customerAccessToken: customerAccessToken.value },
		})

	if (getCustomersResponseErrors) {
		const { message } = getCustomersResponseErrors[0]
		return NextResponse.json({ error: message }, { status: 400 })
	}
	const customer = getCustomerResponseData?.customer
	if (!customer) {
		return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
	}

	const { __typename, ...rest } = customer
	return NextResponse.json(rest)
}
