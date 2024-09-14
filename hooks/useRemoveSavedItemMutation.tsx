import { useAuth } from '@/context/AuthContext/AuthContext'
import { restClient } from '@/lib/clients/restClient'
import {
    getLocallySavedItemsUnpopulated,
    setLocallySavedItemsUnpopulated,
    populateSavedItems,
} from '@/lib/core/wishlists'
import { DEFAULT_COLLECTION_LIMIT } from '@/lib/utils/constants'
import { SavedItemsData } from '@/types/store'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useCallback } from 'react'

const useRemoveSavedItemMutation = () => {
    const { isLoggedIn } = useAuth()
    const queryClient = useQueryClient()

    const removeLocallySavedItem = useCallback(
        async (id: string, limit: number = DEFAULT_COLLECTION_LIMIT): Promise<SavedItemsData> => {
            const savedItemsIds = getLocallySavedItemsUnpopulated().filter(
                savedItemId => savedItemId !== id,
            )
            setLocallySavedItemsUnpopulated(savedItemsIds)

            return populateSavedItems(savedItemsIds, limit)
        },
        [],
    )

    const removeSavedItem = useCallback(
        async (id: string, limit: number = DEFAULT_COLLECTION_LIMIT): Promise<SavedItemsData> => {
            try {
                const response = await restClient('/wishlist/items', {
                    method: 'DELETE',
                    body: JSON.stringify({ ids: [id], populate: true, start: limit }),
                })

                setLocallySavedItemsUnpopulated(response.data.savedItemsIds)

                return response.data
            } catch (error) {
                throw error
            }
        },
        [],
    )

    type RemoveSavedItemVariables = {
        id: string
        limit?: number
    }

    const mutationFn = useCallback(
        async ({ id, limit = DEFAULT_COLLECTION_LIMIT }: RemoveSavedItemVariables) => {
            try {
                let response
                if (isLoggedIn) {
                    response = await removeSavedItem(id, limit)
                } else {
                    response = await removeLocallySavedItem(id, limit)
                }

                return response
            } catch (error) {
                throw error
            }
        },
        [removeSavedItem, removeLocallySavedItem, isLoggedIn],
    )

    return useMutation({
        mutationFn,
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ['savedItems'] }),
    })
}

export default useRemoveSavedItemMutation
