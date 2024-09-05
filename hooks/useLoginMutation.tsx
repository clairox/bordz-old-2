import { restClient } from '@/lib/clients/restClient'
import { getLocalWishlistUnpopulated, setLocalWishlistUnpopulated } from '@/lib/core/wishlists'
import { LoginData } from '@/types'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useCallback } from 'react'

const useLoginMutation = () => {
    const queryClient = useQueryClient()

    const mutationFn = useCallback(async (loginData: LoginData) => {
        const guestCartId = localStorage.getItem('cartId')
        const guestWishlist = getLocalWishlistUnpopulated()

        try {
            const response = await restClient('/login', {
                method: 'POST',
                body: JSON.stringify({ ...loginData, guestCartId, guestWishlist }),
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

export default useLoginMutation
