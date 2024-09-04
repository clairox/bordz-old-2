import { useAuth } from '@/context/AuthContext/AuthContext'
import { queryClient } from '@/lib/clients/queryClient'
import { RestClientError, restClient } from '@/lib/clients/restClient'
import { UpdatePersonalInfoValues } from '@/types/store'
import { useMutation } from '@tanstack/react-query'

export const useAccountMutations = () => {
    const { data } = useAuth()
    const queryKey = ['getCustomer']

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
        onError: (error: Error) => console.error(error),
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
            const customerId = data?.id
            if (customerId == undefined) {
                return false
            }

            const config = {
                method: 'DELETE',
                body: JSON.stringify({ id: customerId }),
            }

            try {
                await restClient('/customer', config)
                return true
            } catch (error) {
                if (error instanceof RestClientError) {
                    if (error.response.status === 401) {
                        console.error('You are not allowed to do that!')
                        throw new Error('Session expired')
                    } else {
                        throw new Error(error.response.data.message)
                    }
                } else {
                    throw error
                }
            }
        },
        onSuccess: () => queryClient.invalidateQueries({ queryKey, refetchType: 'none' }),
    })

    return {
        updatePersonalDetails,
        updatePassword,
        deleteCustomer,
    }
}
