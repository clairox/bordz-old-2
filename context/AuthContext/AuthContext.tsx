'use client'
import { createContext, useContext, useEffect, useState } from 'react'

type User = {
	id: string
	email: string
	firstName: string
	lastName: string
	displayName: string
}

type AuthContextValue = {
	user: User | undefined
	isLoggedIn: boolean
	login: (email: string, password: string) => Promise<boolean>
	signup: (email: string, password: string, firstName: string, lastName: string) => Promise<boolean>
	logout: () => Promise<boolean>
}

const AuthContext = createContext<AuthContextValue>({
	user: undefined,
	isLoggedIn: false,
	login: async () => false,
	signup: async () => false,
	logout: async () => false,
})

const AuthProvider: React.FunctionComponent<React.PropsWithChildren> = ({ children }) => {
	const auth = useProvideAuth()
	return <AuthContext.Provider value={auth}>{children}</AuthContext.Provider>
}

const useAuth = () => useContext(AuthContext)

const initialAuthState = { user: undefined, isLoggedIn: false }

const useProvideAuth = () => {
	const [authState, setAuthState] = useState(initialAuthState)

	useEffect(() => {
		const getUser = async () => {
			console.log('Getting customer info...')
			const response = await fetch(`http://localhost:3000/api/customer`, {
				method: 'GET',
				headers: {
					'Content-Type': 'application/json',
				},
			})

			if (response.ok) {
				const user = await response.json()
				setAuthState({ isLoggedIn: true, user })
				console.log('You are logged in!')
			} else {
				console.log('You are not logged in.')
			}
		}

		getUser()
	}, [])

	const login = async (email: string, password: string): Promise<boolean> => {
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
			setAuthState({ isLoggedIn: true, user })
			return true
		}

		return false
	}

	const signup = async (
		email: string,
		password: string,
		firstName: string,
		lastName: string
	): Promise<boolean> => {
		return false
	}
	const logout = async (): Promise<boolean> => {
		const response = await fetch(`http://localhost:3000/api/logout`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			cache: 'no-cache',
		})

		if (response.ok) {
			setAuthState(initialAuthState)
			return true
		}

		return false
	}

	return {
		user: authState.user,
		isLoggedIn: authState.isLoggedIn,
		login,
		signup,
		logout,
	}
}

export { AuthProvider, useAuth }
