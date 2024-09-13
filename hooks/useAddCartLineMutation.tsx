import { restClient } from '@/lib/clients/restClient'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useCallback } from 'react'

const useAddCartLineMutation = () => {
    const queryClient = useQueryClient()

    type UseAddCartLineVariables = {
        cartId: string
        variantId: string
        quantity?: number
    }

    const mutationFn = useCallback(
        async ({ cartId, variantId, quantity = 1 }: UseAddCartLineVariables) => {
            try {
                const response = await restClient(`/cart/${encodeURIComponent(cartId)}/cartLines`, {
                    method: 'POST',
                    body: JSON.stringify({
                        lines: [
                            {
                                merchandiseId: variantId,
                                quantity: quantity,
                            },
                        ],
                    }),
                })

                return response.data
            } catch (error) {
                throw error
            }
        },
        [],
    )

    return useMutation({
        mutationFn,
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ['getCart'] }),
    })
}

export default useAddCartLineMutation
