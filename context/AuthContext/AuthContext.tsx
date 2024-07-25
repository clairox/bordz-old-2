'use client'
import { createContext, useContext, useState } from 'react'

type LoadState = 'idle' | 'loading' | 'succeeded' | 'failed'

type AuthContextValue = {
	loadState: LoadState
	login: (email: string, password: string) => Promise<Record<string, any>>
	signup: (
		firstName: string,
		lastName: string,
		email: string,
		password: string
	) => Promise<Record<string, any>>
	logout: () => Promise<Record<string, any>>
}

const AuthContext = createContext<AuthContextValue>({
	loadState: 'idle',
	login: async () => ({}),
	signup: async () => ({}),
	logout: async () => ({}),
})

const AuthProvider: React.FunctionComponent<React.PropsWithChildren> = ({ children }) => {
	const auth = useProvideAuth()
	return <AuthContext.Provider value={auth}>{children}</AuthContext.Provider>
}

const useAuth = () => useContext(AuthContext)

const initialLoadState = 'idle'

const useProvideAuth = () => {
	const [loadState, setLoadState] = useState<LoadState>(initialLoadState)

	const login = async (email: string, password: string): Promise<Record<string, any>> => {
		setLoadState('loading')

		const response = await fetch(`http://localhost:3000/api/login`, {
			method: 'POST',
			body: JSON.stringify({ email, password }),
			headers: {
				'Content-Type': 'application/json',
			},
			cache: 'no-cache',
		})

		if (response.ok) {
			const user = await response.json()
			setLoadState('succeeded')
			return user
		}

		setLoadState('failed')
		return await response.json()
	}

	const signup = async (
		firstName: string,
		lastName: string,
		email: string,
		password: string
	): Promise<Record<string, any>> => {
		setLoadState('loading')

		const response = await fetch(`http://localhost:3000/api/signup`, {
			method: 'POST',
			body: JSON.stringify({ firstName, lastName, email, password }),
			headers: {
				'Content-Type': 'application/json',
			},
			cache: 'no-cache',
		})

		if (response.ok) {
			const newUser = await response.json()
			return await login(newUser.email, password)
		}

		setLoadState(initialLoadState)
		return await response.json()
	}
	const logout = async (): Promise<Record<string, any>> => {
		setLoadState('loading')

		const response = await fetch(`http://localhost:3000/api/logout`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			cache: 'no-cache',
		})

		if (response.ok) {
			setLoadState(initialLoadState)
			return await response.json()
		}

		setLoadState('failed')
		return await response.json()
	}

	return {
		loadState: loadState,
		login,
		signup,
		logout,
	}
}

export { AuthProvider, useAuth }

// TODO: Make wrapper for fetch or use something else
