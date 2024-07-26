import { NextRequest, NextResponse } from 'next/server'
import { getClient } from '@/lib/apollo/apolloClient'
import { SIGNUP } from '@/lib/mutations'

export const POST = async (request: NextRequest) => {
	const { firstName, lastName, email, password } = await request.json()

	const { data, errors } = await getClient().mutate({
		mutation: SIGNUP,
		variables: { firstName, lastName, email, password },
	})

	if (errors) {
		const { message, extensions } = errors[0]
		return NextResponse.json({ error: { code: extensions.code, message } }, { status: 400 })
	}

	const customerUserErrors = data?.customerCreate?.customerUserErrors
	if (customerUserErrors && customerUserErrors.length > 0) {
		const { code, field } = customerUserErrors[0]
		switch (code) {
			case 'TAKEN':
				return NextResponse.json(
					{ error: { code, message: 'Email is already taken', field: field?.at(1) } },
					{ status: 409 }
				)
			default:
				return NextResponse.json(
					{ error: { code: 'INTERNAL_SERVER_ERROR', message: 'Internal Server Error' } },
					{ status: 500 }
				)
		}
	}

	const customer = data?.customerCreate?.customer
	if (!customer) {
		return NextResponse.json(
			{ error: { code: 'INTERNAL_SERVER_ERROR', message: 'Internal Server Error' } },
			{ status: 500 }
		)
	}

	return NextResponse.json({ email: customer.email })
}
