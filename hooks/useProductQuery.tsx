import { useCallback } from 'react'
import { restClient } from '@/lib/clients/restClient'
import { useQuery } from '@tanstack/react-query'

const useProductQuery = (handle: string) => {
    const queryFn = useCallback(async () => {
        const url = '/products/' + handle

        try {
            const response = await restClient(url)
            return response.data
        } catch (error) {
            throw error as Error
        }
    }, [handle])

    return useQuery({
        queryKey: ['getProduct', handle],
        queryFn,
    })
}

export default useProductQuery
