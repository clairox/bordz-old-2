import { restClient } from '@/lib/clients/restClient'
import { SavedItemsData } from '@/types/store'

const DEFAULT_LIMIT = 40

export const mergeSavedItemLists = (source: string[], target: string[]): string[] => {
    const mergedList = new Array(...target)
    source.forEach(item => {
        if (!target.includes(item)) {
            mergedList.push(item)
        }
    })

    return mergedList
}

export const populateSavedItems = async (
    savedItemsIds: string[],
    limit: number = DEFAULT_LIMIT,
    cursor?: string,
): Promise<SavedItemsData> => {
    try {
        const response = await restClient('/productVariants', {
            method: 'POST',
            body: JSON.stringify({
                ids: savedItemsIds,
                sz: limit,
                cursor,
            }),
        })

        const { productVariants: populatedItems, hasNextPage, endCursor } = response.data
        return { savedItemsIds, populatedItems, hasNextPage, endCursor }
    } catch (error) {
        throw error
    }
}

export const getLocallySavedItemsUnpopulated = (): string[] =>
    JSON.parse(localStorage.getItem('wishlist') || '[]')

export const setLocallySavedItemsUnpopulated = (savedItemsIds: string[]) =>
    localStorage.setItem('wishlist', JSON.stringify(savedItemsIds))

export const isItemSaved = (id: string): boolean => {
    return getLocallySavedItemsUnpopulated().includes(id)
}
