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

const useAddSavedItemItemMutation = () => {
    const { isLoggedIn } = useAuth()
    const queryClient = useQueryClient()

    const addLocallySavedItem = useCallback(
        async (id: string, limit: number = DEFAULT_COLLECTION_LIMIT): Promise<SavedItemsData> => {
            const savedItemsIds = getLocallySavedItemsUnpopulated().concat(id)
            setLocallySavedItemsUnpopulated(savedItemsIds)

            return populateSavedItems(savedItemsIds, limit)
        },
        [],
    )

    const addSavedItem = useCallback(
        async (id: string, limit: number = DEFAULT_COLLECTION_LIMIT): Promise<SavedItemsData> => {
            try {
                const response = await restClient('/wishlist/items', {
                    method: 'POST',
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

    type AddSavedItemVariables = {
        id: string
        limit?: number
    }

    const mutationFn = useCallback(
        async ({ id, limit = DEFAULT_COLLECTION_LIMIT }: AddSavedItemVariables) => {
            try {
                let response
                if (isLoggedIn) {
                    response = await addSavedItem(id, limit)
                } else {
                    response = await addLocallySavedItem(id, limit)
                }

                return response
            } catch (error) {
                throw error
            }
        },
        [addLocallySavedItem, addSavedItem, isLoggedIn],
    )

    return useMutation({
        mutationFn,
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ['savedItems'] }),
    })
}

export default useAddSavedItemItemMutation
