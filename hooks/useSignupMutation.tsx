import { restClient } from '@/lib/clients/restClient'
import { getLocalWishlistUnpopulated, setLocalWishlistUnpopulated } from '@/lib/core/wishlists'
import { SignupData } from '@/types'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useCallback } from 'react'

const useSignupMutation = () => {
    const queryClient = useQueryClient()

    const mutationFn = useCallback(async (signupData: SignupData) => {
        const guestCartId = localStorage.getItem('cartId')
        const guestWishlist = getLocalWishlistUnpopulated()

        try {
            const response = await restClient('/signup', {
                method: 'POST',
                body: JSON.stringify({ ...signupData, guestCartId, guestWishlist }),
            })

            const { cartId, wishlist, data } = response.data

            localStorage.setItem('cartId', cartId)
            setLocalWishlistUnpopulated(wishlist)

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
