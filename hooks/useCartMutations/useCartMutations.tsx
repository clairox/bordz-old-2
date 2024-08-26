import { queryClient } from '@/lib/clients/queryClient'
import { restClient } from '@/lib/clients/restClient'
import { loadCartId } from '@/lib/core/carts'
import { useMutation } from '@tanstack/react-query'
import { useCallback } from 'react'

const useCartMutations = (cartId: string) => {
    const addCartLine = useCallback(
        // TODO: default quantity to 1
        async (args: { variantId: string; quantity: number }) => {
            const { variantId, quantity } = args
            try {
                const response = await restClient(`/cart/${encodeURIComponent(cartId)}/cartLines`, {
                    method: 'POST',
                    body: JSON.stringify({
                        lines: [
                            {
                                merchandiseId: variantId,
                                quantity,
                            },
                        ],
                    }),
                })

                return response.data
            } catch (error) {
                throw error
            }
        },
        [cartId],
    )

    const updateCartLine = useCallback(
        async (args: { lineId: string; quantity: number }) => {
            const { lineId, quantity } = args
            try {
                const response = await restClient(`/cart/${encodeURIComponent(cartId)}/cartLines`, {
                    method: 'PATCH',
                    body: JSON.stringify({
                        lines: [
                            {
                                id: lineId,
                                quantity,
                            },
                        ],
                    }),
                })

                return response.data
            } catch (error) {
                throw error
            }
        },
        [cartId],
    )

    const deleteCartLine = useCallback(
        async (lineId: string) => {
            try {
                const response = await restClient(`/cart/${encodeURIComponent(cartId)}/cartLines`, {
                    method: 'DELETE',
                    body: JSON.stringify({
                        lineIds: [lineId],
                    }),
                })

                return response.data
            } catch (error) {
                throw error
            }
        },
        [cartId],
    )

    const addCartLineMutation = useMutation({
        mutationFn: addCartLine,
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ['getCart', cartId] }),
    })

    const updateCartLineMutation = useMutation({
        mutationFn: updateCartLine,
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ['getCart', cartId] }),
    })

    const deleteCartLineMutation = useMutation({
        mutationFn: deleteCartLine,
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ['getCart', cartId] }),
    })

    return {
        addCartLineMutation,
        updateCartLineMutation,
        deleteCartLineMutation,
    }
}
