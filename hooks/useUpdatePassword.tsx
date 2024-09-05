import { RestClientError, restClient } from '@/lib/clients/restClient'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useCallback } from 'react'

const useUpdatePassword = () => {
    const queryClient = useQueryClient()

    type UpdatePasswordVariables = { password: string }
    const mutationFn = useCallback(async ({ password }: UpdatePasswordVariables) => {
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
    }, [])

    return useMutation({
        mutationFn,
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ['getCustomer'] }),
    })
}

export default useUpdatePassword
