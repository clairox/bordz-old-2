'use client'
import { restClient } from '@/lib/clients/restClient'
import { CustomerAuthData } from '@/types'
import { useQuery } from '@tanstack/react-query'
import React, { createContext, useCallback, useContext } from 'react'

type AuthContextValue = {
    isLoggedIn: boolean
    data: CustomerAuthData | undefined
    error: Error | null
    isPending: boolean
    isSuccess: boolean
}

const AuthContext = createContext<AuthContextValue>({
    isLoggedIn: false,
    data: undefined,
    error: null,
    isPending: true,
    isSuccess: false,
})

const AuthProvider: React.FunctionComponent<React.PropsWithChildren> = ({ children }) => {
    const getAuth = useCallback(async () => {
        try {
            const response = await restClient('/auth/check')

            if (response.status === 204) {
                return { isLoggedIn: false, data: undefined }
            }

            return { isLoggedIn: true, data: response.data as CustomerAuthData }
        } catch (error) {
            throw error
        }
    }, [])

    const { data, error, isPending, isSuccess } = useQuery({
        queryKey: ['getAuth'],
        queryFn: getAuth,
    })

    return (
        <AuthContext.Provider
            value={{
                isLoggedIn: data ? data.isLoggedIn : false,
                data: data ? data.data : undefined,
                error,
                isPending,
                isSuccess,
            }}
        >
            {children}
        </AuthContext.Provider>
    )
}

const useAuth = () => useContext(AuthContext)

export { AuthProvider, useAuth }
