import { queryClient } from '@/lib/clients/queryClient'
import { restClient } from '@/lib/clients/restClient'
import { useMutation } from '@tanstack/react-query'

export const useCartMutations = (cartId: string) => {
    const addCartLine = useMutation({
        // TODO: default quantity to 1
        mutationFn: async (args: { variantId: string; quantity: number }) => {
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
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ['getCart'] }),
    })

    const updateCartLine = useMutation({
        mutationFn: async (args: { lineId: string; quantity: number }) => {
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
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ['getCart'] }),
    })

    const deleteCartLine = useMutation({
        mutationFn: async (lineId: string) => {
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
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ['getCart'] }),
    })

    return {
        addCartLine,
        updateCartLine,
        deleteCartLine,
    }
}
