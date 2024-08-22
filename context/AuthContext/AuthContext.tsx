'use client'
import { RestClientError, restClient } from '@/lib/clients/restClient'
import { getLocalWishlistUnpopulated, setLocalWishlistUnpopulated } from '@/lib/core/wishlists'
import React, { createContext, useCallback, useContext, useEffect, useReducer } from 'react'

type SignupData = {
    email: string
    password: string
    firstName: string
    lastName: string
    birthDate: Date
    phone?: string
}

type AuthContextValue = {
    customerId: string | undefined
    loading: boolean
    error: RestClientError | undefined
    login: (email: string, password: string) => Promise<boolean>
    signup: (data: SignupData) => Promise<boolean>
    logout: () => Promise<boolean>
}

const AuthContext = createContext<AuthContextValue>({
    customerId: undefined,
    loading: true,
    error: undefined,
    login: async () => false,
    signup: async () => false,
    logout: async () => false,
})

type AuthState = {
    customerId: string | undefined
    loading: boolean
    error: RestClientError | undefined
}

type AuthAction =
    | { type: 'LOADING' }
    | { type: 'UNAUTHENTICATED' }
    | { type: 'SUCCESS'; payload: { customerId: string } }
    | { type: 'FAILURE'; payload: { error: RestClientError } }

const reducer = (state: AuthState, action: AuthAction) => {
    switch (action.type) {
        case 'LOADING':
            return {
                ...state,
                loading: true,
            }
        case 'UNAUTHENTICATED':
            return {
                customerId: undefined,
                loading: false,
                error: undefined,
            }
        case 'SUCCESS':
            return {
                customerId: action.payload.customerId,
                loading: false,
                error: undefined,
            }
        case 'FAILURE':
            return {
                customerId: undefined,
                loading: false,
                error: action.payload.error,
            }
        default:
            throw new Error(`Unhandled action type ${action}`)
    }
}

const initialState: AuthState = {
    customerId: undefined,
    loading: true,
    error: undefined,
}

const AuthProvider: React.FunctionComponent<React.PropsWithChildren> = ({ children }) => {
    const [state, dispatch] = useReducer(reducer, initialState)

    const getCustomerId = useCallback(async () => {
        dispatch({ type: 'LOADING' })

        try {
            const response = await restClient('/auth/check')

            if (response.status === 200) {
                dispatch({ type: 'SUCCESS', payload: { customerId: response.data.id } })
                console.log('Customer authenticated!')
            } else {
                dispatch({ type: 'UNAUTHENTICATED' })
                console.log('Welcome guest!')
            }
        } catch (error) {
            dispatch({ type: 'FAILURE', payload: { error: error as RestClientError } })
        }
    }, [])

    useEffect(() => {
        getCustomerId()
    }, [getCustomerId])

    const login = useCallback(async (email: string, password: string): Promise<boolean> => {
        dispatch({ type: 'LOADING' })

        try {
            const guestCartId = localStorage.getItem('cartId')
            const guestWishlist = getLocalWishlistUnpopulated()

            const response = await restClient('/login', {
                method: 'POST',
                body: JSON.stringify({ email, password, guestCartId, guestWishlist }),
            })

            const { customerId, cartId, wishlist } = response.data

            dispatch({ type: 'SUCCESS', payload: { customerId } })

            localStorage.setItem('cartId', cartId)
            setLocalWishlistUnpopulated(wishlist)

            return true
        } catch (error) {
            dispatch({ type: 'FAILURE', payload: { error: error as RestClientError } })
            return false
        }
    }, [])

    const signup = useCallback(async (data: SignupData): Promise<boolean> => {
        dispatch({ type: 'LOADING' })

        try {
            const guestCartId = localStorage.getItem('cartId')
            const guestWishlist = getLocalWishlistUnpopulated()

            const response = await restClient('/signup', {
                method: 'POST',
                body: JSON.stringify({ ...data, guestCartId, guestWishlist }),
            })

            const { customerId, cartId, wishlist } = response.data

            dispatch({ type: 'SUCCESS', payload: { customerId } })

            localStorage.setItem('cartId', cartId)
            setLocalWishlistUnpopulated(wishlist)

            return true
        } catch (error) {
            dispatch({ type: 'FAILURE', payload: { error: error as RestClientError } })
            return false
        }
    }, [])

    const logout = useCallback(async (): Promise<boolean> => {
        dispatch({ type: 'LOADING' })

        try {
            const response = await restClient('/logout', {
                method: 'POST',
                cache: 'no-cache',
            })

            dispatch({ type: 'SUCCESS', payload: { customerId: response.data.id } })

            localStorage.removeItem('cartId')
            localStorage.setItem('wishlist', '[]')

            return true
        } catch (error) {
            dispatch({ type: 'FAILURE', payload: { error: error as RestClientError } })
            return false
        }
    }, [])

    return (
        <AuthContext.Provider
            value={{
                ...state,
                login,
                signup,
                logout,
            }}
        >
            {children}
        </AuthContext.Provider>
    )
}

const useAuth = () => useContext(AuthContext)

export { AuthProvider, useAuth }
