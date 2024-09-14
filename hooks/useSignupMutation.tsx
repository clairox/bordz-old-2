import { restClient } from '@/lib/clients/restClient'
import {
    getLocallySavedItemsUnpopulated,
    setLocallySavedItemsUnpopulated,
} from '@/lib/core/wishlists'
import { SignupData } from '@/types'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useCallback } from 'react'

const useSignupMutation = () => {
    const queryClient = useQueryClient()

    const mutationFn = useCallback(async (signupData: SignupData) => {
        const guestCartId = localStorage.getItem('cartId')
        const guestSavedItemsIds = getLocallySavedItemsUnpopulated()

        try {
            const response = await restClient('/signup', {
                method: 'POST',
                body: JSON.stringify({
                    ...signupData,
                    guestCartId,
                    guestSavedItemsIds,
                }),
            })

            const { cartId, savedItemsIds, data } = response.data

            localStorage.setItem('cartId', cartId)
            setLocallySavedItemsUnpopulated(savedItemsIds)

            return { isLoggedIn: true, data }
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

export default useSignupMutation
