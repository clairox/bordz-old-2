'use client'
import { createContext, useContext, useEffect, useState } from 'react'

type User = {
	id: string
	email: string
	firstName: string
	lastName: string
	displayName: string
}

type LoadState = 'idle' | 'loading' | 'succeeded' | 'failed'

type AuthContextValue = {
	user: User | undefined
	isLoggedIn: boolean
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
	user: undefined,
	isLoggedIn: false,
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

const initialAuthState = { user: undefined, isLoggedIn: false, loadState: 'idle' as LoadState }

const useProvideAuth = () => {
	const [authState, setAuthState] = useState<{
		user: User | undefined
		isLoggedIn: boolean
		loadState: LoadState
	}>(initialAuthState)

	useEffect(() => {
		setAuthState(prev => ({ ...prev, loadState: 'loading' }))
		const getUser = async () => {
			const response = await fetch(`http://localhost:3000/api/customer`, {
				method: 'GET',
				headers: {
					'Content-Type': 'application/json',
				},
			})

			if (response.ok) {
				const user = await response.json()
				setAuthState({ isLoggedIn: true, user, loadState: 'succeeded' })
			} else {
				setAuthState({ ...initialAuthState, loadState: 'failed' })
			}
		}

		getUser()
	}, [])

	const login = async (email: string, password: string): Promise<Record<string, any>> => {
		setAuthState(prev => ({ ...prev, loadState: 'loading' }))

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
			setAuthState({ isLoggedIn: true, user, loadState: 'succeeded' })
			return user
		}

		setAuthState({ ...initialAuthState, loadState: 'failed' })
		return await response.json()
	}

	const signup = async (
		firstName: string,
		lastName: string,
		email: string,
		password: string
	): Promise<Record<string, any>> => {
		setAuthState(prev => ({ ...prev, loading: 'loading' }))

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

		setAuthState(initialAuthState)
		return await response.json()
	}
	const logout = async (): Promise<Record<string, any>> => {
		setAuthState(prev => ({ ...prev, loadState: 'loading' }))

		const response = await fetch(`http://localhost:3000/api/logout`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			cache: 'no-cache',
		})

		if (response.ok) {
			setAuthState(initialAuthState)
			return await response.json()
		}

		setAuthState({ ...initialAuthState, loadState: 'failed' })
		return await response.json()
	}

	return {
		user: authState.user,
		isLoggedIn: authState.isLoggedIn,
		loadState: authState.loadState,
		login,
		signup,
		logout,
	}
}

export { AuthProvider, useAuth }

// TODO: Make wrapper for fetch or use something else
