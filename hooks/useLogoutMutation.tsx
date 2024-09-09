import { restClient } from '@/lib/clients/restClient'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useCallback } from 'react'

const useLogoutMutation = () => {
    const queryClient = useQueryClient()

    const mutationFn = useCallback(async () => {
        try {
            await restClient('/logout', {
                method: 'POST',
                cache: 'no-cache',
            })

            localStorage.removeItem('cartId')
            localStorage.setItem('wishlist', '[]')

            return { isLoggedIn: false, data: undefined }
        } catch (error) {
            throw error
        }
    }, [])

    const onSuccess = () => {
        queryClient.invalidateQueries({ queryKey: ['getAuth'] })
        queryClient.invalidateQueries({ queryKey: ['getCart'] })
    }

    return useMutation({ mutationFn, onSuccess })
}

export default useLogoutMutation
