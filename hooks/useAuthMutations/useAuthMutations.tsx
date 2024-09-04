import { queryClient } from '@/lib/clients/queryClient'
import { restClient } from '@/lib/clients/restClient'
import { getLocalWishlistUnpopulated, setLocalWishlistUnpopulated } from '@/lib/core/wishlists'
import { LoginData, SignupData } from '@/types'
import { useMutation } from '@tanstack/react-query'
import { useCallback } from 'react'

export const useAuthMutations = () => {
    const queryKey = ['getAuth']

    const invalidateQueries = () => {
        queryClient.invalidateQueries({ queryKey })
        queryClient.invalidateQueries({ queryKey: ['getCart'] })
    }

    const login = useMutation({
        mutationFn: async (loginData: LoginData) => {
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
        },
        onSuccess: () => invalidateQueries(),
    })

    const signup = useMutation({
        mutationFn: async (signupData: SignupData) => {
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
        },
        onSuccess: () => invalidateQueries(),
    })

    const logout = useMutation({
        mutationFn: async () => {
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
        },
        onSuccess: () => invalidateQueries(),
    })

    const confirmCredentials = useMutation({
        mutationFn: async (credentials: LoginData) => {
            try {
                await restClient('/auth/confirm', {
                    method: 'POST',
                    body: JSON.stringify(credentials),
                    cache: 'no-cache',
                })

                return true
            } catch (error) {
                return false
            }
        },
    })

    return {
        login,
        signup,
        logout,
        confirmCredentials,
    }
}
