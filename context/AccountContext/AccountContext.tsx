'use client'
import { restClient } from '@/lib/clients/restClient'
import { Customer } from '@/types/store'
import { useQuery } from '@tanstack/react-query'
import React, { createContext, useContext } from 'react'

type AccountContextValue = {
    data: Customer | undefined
    error: Error | null
}

const AccountContext = createContext<AccountContextValue>({
    data: undefined,
    error: null,
})

export const useAccount = () => useContext(AccountContext)

export const AccountProvider: React.FunctionComponent<React.PropsWithChildren> = ({ children }) => {
    const queryKey = ['getCustomer']

    const { data, error, isPending } = useQuery({
        queryKey,
        queryFn: async () => {
            try {
                const response = await restClient('/customer')
                return response.data
            } catch (error) {
                throw error
            }
        },
    })

    if (isPending) {
        return <>Loading...</>
    }

    return (
        <AccountContext.Provider
            value={{
                data,
                error,
            }}
        >
            {children}
        </AccountContext.Provider>
    )
}
