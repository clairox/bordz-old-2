import { fetcher } from '../fetcher'
import { FetcherError } from '../fetcher/fetcher'

type AuthResponse = {
	success: boolean
	data?: any
	error?: { message: string; code: string; field?: string[] }
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
		const { cartId } = response.data
		localStorage.setItem('cartId', cartId)

		return await login(email, password)
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
	const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/logout`, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
		},
		cache: 'no-cache',
	})

	return await response.json()
}
