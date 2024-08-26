'use client'
import { queryClient } from '@/lib/clients/queryClient'
import { restClient } from '@/lib/clients/restClient'
import { RestClientError } from '@/lib/clients/restClient'
import { UpdatePersonalInfoValues } from '@/types/store'
import { UseMutationResult, useMutation, useQuery } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'
import React, { createContext, useContext } from 'react'

type AccountContextValue = {
    data: any
    error: any
    updatePersonalDetails?: UseMutationResult<any, Error, UpdatePersonalInfoValues, unknown>
    updatePassword?: UseMutationResult<any, Error, string, unknown>
    deleteCustomer?: UseMutationResult<any, Error, void, unknown>
}

const AccountContext = createContext<AccountContextValue>({
    data: undefined,
    error: undefined,
    updatePersonalDetails: undefined,
    updatePassword: undefined,
    deleteCustomer: undefined,
})

export const useAccount = () => useContext(AccountContext)

export const AccountProvider: React.FunctionComponent<
    React.PropsWithChildren<{ customerId: string }>
> = ({ children, customerId }) => {
    const router = useRouter()

    const queryKey = ['getCustomer', customerId]

    const { data, error, isPending } = useQuery({
        queryKey,
        queryFn: async () => {
            try {
                const response = await restClient('/customer')
                return response.data
            } catch (error) {
                router.replace('/login')
            }
        },
    })

    const updatePersonalDetails = useMutation({
        mutationFn: async (data: UpdatePersonalInfoValues) => {
            try {
                const response = await restClient('/customer', {
                    method: 'PATCH',
                    body: JSON.stringify(data),
                })

                return response.data
            } catch (error) {
                if (error instanceof RestClientError) {
                    if (error.response.status === 401) {
                        throw new Error('Session expired')
                    } else {
                        throw new Error(error.response.data.message)
                    }
                } else {
                    throw error
                }
            }
        },
        onSuccess: () => queryClient.invalidateQueries({ queryKey }),
        onError: error => console.error(error),
    })

    const updatePassword = useMutation({
        mutationFn: async (password: string) => {
            try {
                const response = await restClient('/customer', {
                    method: 'PATCH',
                    body: JSON.stringify({ password }),
                })

                return response.data
            } catch (error) {
                if (error instanceof RestClientError) {
                    if (error.response.status === 401) {
                        throw new Error('Session expired')
                    } else {
                        throw new Error(error.response.data.message)
                    }
                } else {
                    throw error
                }
            }
        },
        onSuccess: () => queryClient.invalidateQueries({ queryKey }),
    })

    const deleteCustomer = useMutation({
        mutationFn: async () => {
            const customer = data.customer
            if (customer == undefined) {
                return false
            }

            const config = {
                method: 'DELETE',
                body: JSON.stringify({ id: customer.id }),
            }

            try {
                await restClient('/customer', config)
                return true
            } catch (error) {
                if (error instanceof RestClientError) {
                    if (error.response.status === 401) {
                        console.log('You are not allowed to do that!')
                        throw new Error('Session expired')
                    } else {
                        throw new Error(error.response.data.message)
                    }
                } else {
                    throw error
                }
            }
        },
        onSuccess: () => queryClient.invalidateQueries({ queryKey }),
    })

    if (isPending) {
        return <>Loading...</>
    }

    return (
        <AccountContext.Provider
            value={{
                data,
                error,
                updatePersonalDetails,
                updatePassword,
                deleteCustomer,
            }}
        >
            {children}
        </AccountContext.Provider>
    )
}
