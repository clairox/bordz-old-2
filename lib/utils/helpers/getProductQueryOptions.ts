import { restClient } from '@/lib/clients/restClient'
import { Product } from '@/types/store'
import { queryOptions } from '@tanstack/react-query'

export const getProductQueryOptions = (handle: string) => {
    return queryOptions<Product>({
        queryKey: ['getProduct', handle],
        queryFn: async () => {
            const url = '/products/' + handle

            try {
                const response = await restClient(url)
                return response.data
            } catch (error) {
                throw error as Error
            }
        },
    })
}
