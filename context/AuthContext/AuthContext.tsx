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
	logout: () => void
}

const AuthContext = createContext<AuthContextValue>({
	user: undefined,
	isLoggedIn: false,
	login: async () => false,
	signup: async () => false,
	logout: () => null,
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
		if (authState.isLoggedIn) {
			console.log(authState.user)
		}
	}, [authState])

	const login = async (email: string, password: string): Promise<boolean> => {
		const response = await fetch(`http://localhost:3000/api/login`, {
			method: 'POST',
			body: JSON.stringify({ email, password }),
			headers: {
				'Content-Type': 'application/json',
			},
			cache: 'no-cache',
		})

		const user = await response.json()

		if (user) {
			setAuthState(prev => ({ isLoggedIn: true, user }))
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
	const logout = () => {}

	return {
		user: authState.user,
		isLoggedIn: authState.isLoggedIn,
		login,
		signup,
		logout,
	}
}

export { AuthProvider, useAuth }
