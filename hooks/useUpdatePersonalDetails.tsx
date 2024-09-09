import { RestClientError, restClient } from '@/lib/clients/restClient'
import { UpdatePersonalInfoValues } from '@/types/store'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useCallback } from 'react'

const useUpdatePersonalDetails = () => {
    const queryClient = useQueryClient()

    const mutationFn = useCallback(async (data: UpdatePersonalInfoValues) => {
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
    }, [])

    return useMutation({
        mutationFn,
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ['getCustomer'] }),
        onError: (error: Error) => console.error(error),
    })
}

export default useUpdatePersonalDetails
