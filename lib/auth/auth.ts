type AuthResponse = {
	success: boolean
	data?: any
	error?: { code: string; message: string; field?: string[] }
}

interface LoginResponse extends AuthResponse {}
export const login = async (email: string, password: string): Promise<LoginResponse> => {
	const response = await fetch(`http://localhost:3000/api/login`, {
		method: 'POST',
		body: JSON.stringify({ email, password }),
		headers: {
			'Content-Type': 'application/json',
		},
		cache: 'no-cache',
	})

	return await response.json()
}

interface SignupResponse extends AuthResponse {}
export const signup = async (
	email: string,
	password: string,
	firstName: string,
	lastName: string
): Promise<SignupResponse> => {
	const response = await fetch(`http://localhost:3000/api/signup`, {
		method: 'POST',
		body: JSON.stringify({ firstName, lastName, email, password }),
		headers: {
			'Content-Type': 'application/json',
		},
		cache: 'no-cache',
	})

	if (response.ok) {
		const { data: customer } = await response.json()
		return await login(customer.email, password)
	}

	return await response.json()
}

type LogoutResponse = Omit<AuthResponse, 'data'>
export const logout = async (): Promise<LogoutResponse> => {
	const response = await fetch(`http://localhost:3000/api/logout`, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
		},
		cache: 'no-cache',
	})

	return await response.json()
}
