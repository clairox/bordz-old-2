import { useQuery } from '@tanstack/react-query'
import { getProductQueryOptions } from '@/lib/utils/helpers'

const useProductQuery = (handle: string) => {
    return useQuery(getProductQueryOptions(handle))
}

export default useProductQuery
