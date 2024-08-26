import { useCallback } from 'react'
import { restClient } from '@/lib/clients/restClient'
import { useQuery } from '@tanstack/react-query'

const useProduct = (handle: string) => {
    const fetchProduct = useCallback(async () => {
        const url = '/products/' + handle

        try {
            const response = await restClient(url)
            return response.data
        } catch (error) {
            throw error as Error
        }
    }, [handle])

    const { data, error, isPending } = useQuery({
        queryKey: ['getProduct', handle],
        queryFn: fetchProduct,
    })

    return {
        data,
        error,
        isPending,
    }
}

export default useProduct
