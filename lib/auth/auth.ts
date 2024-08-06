import { print } from 'graphql'
import { fetcher } from '../fetcher'
import { FetcherError, gqlStorefrontFetcher } from '../fetcher/fetcher'
import { GET_CART } from '../storefrontAPI/queries'
import { toSafeCart } from '../utils/gql'
import { GetCartQuery } from '@/__generated__/storefront/graphql'
import { ADD_CART_LINES } from '../storefrontAPI/mutations'
import { Cart } from '@/types/store'

type AuthResponse = {
	success: boolean
	data?: any
	error?: { message: string; code: string; field?: string[] }
}

const getCustomer = async () => {
	try {
		const response = await fetcher('/customer')
		return response.data
	} catch (error) {
		throw error
	}
}

const mergeCarts = async (sourceCartId: string, targetCartId: string): Promise<Cart | null> => {
	const { data, error } = await gqlStorefrontFetcher({
		query: print(GET_CART),
		variables: {
			id: sourceCartId,
		},
	})

	if (error) {
		throw new Error(error.message)
	}

	const sourceCart = toSafeCart(data?.cart as GetCartQuery['cart'])
	if (sourceCart == undefined) {
		throw new Error('Something went wrong.')
	}

	const cartLineInput = sourceCart.lines.map(line => {
		return {
			merchandiseId: line.merchandise.id,
			quantity: line.quantity,
		}
	})

	try {
		const result = await gqlStorefrontFetcher({
			query: print(ADD_CART_LINES),
			variables: {
				cartId: targetCartId,
				lines: cartLineInput,
			},
		})

		const targetCart = toSafeCart(result.data?.cartLinesAdd?.cart as GetCartQuery['cart'])
		if (targetCart == undefined) {
			throw new Error('targetCart is undefined')
		}

		return targetCart
	} catch (error) {
		throw error
	}
}

interface LoginResponse extends AuthResponse {}
export const login = async (email: string, password: string): Promise<LoginResponse> => {
	try {
		const config = {
			method: 'POST',
			body: JSON.stringify({ email, password }),
			cache: 'no-cache' as RequestCache,
		}
		const response = await fetcher('/login', config)

		const currentCartId = localStorage.getItem('cartId')
		if (currentCartId) {
			const { cartId: targetCartId } = await getCustomer()
			const targetCart = await mergeCarts(currentCartId, targetCartId)

			if (targetCart != undefined) {
				localStorage.setItem('cartId', targetCart.id)
			}
		}

		return { success: true, data: response.data }
	} catch (error) {
		if (error instanceof FetcherError) {
			const { message, code } = error.response.data
			return { success: false, error: { message, code } }
		} else {
			throw new Error('Something went wrong, please try again.')
		}
	}
}

interface SignupResponse extends AuthResponse {}
export const signup = async (
	email: string,
	password: string,
	firstName: string,
	lastName: string,
	birthDate: Date
): Promise<SignupResponse> => {
	try {
		const config = {
			method: 'POST',
			body: JSON.stringify({ firstName, lastName, birthDate, email, password }),
			cache: 'no-cache' as RequestCache,
		}
		const response = await fetcher('/signup', config)
		const customer = response.data

		return await login(customer.email, password)
	} catch (error) {
		if (error instanceof FetcherError) {
			const { message, code } = error.response.data
			return { success: false, error: { message, code } }
		} else {
			throw new Error('Something went wrong, please try again.')
		}
	}
}

type LogoutResponse = Omit<AuthResponse, 'data'>
export const logout = async (): Promise<LogoutResponse> => {
	try {
		const config = {
			method: 'POST',
			cache: 'no-cache' as RequestCache,
		}
		const response = await fetcher('/logout', config)

		if (response.ok) {
			localStorage.removeItem('cartId')
		}

		return { success: true }
	} catch (error) {
		if (error instanceof FetcherError) {
			const { message, code } = error.response.data
			return { success: false, error: { message, code } }
		} else {
			throw new Error('Something went wrong, please try again.')
		}
	}
}
