import { cookies } from 'next/headers'

export const isAuthenticated = (): boolean => {
	const customerAccessToken = cookies().get('customerAccessToken')
	return customerAccessToken !== undefined
}
