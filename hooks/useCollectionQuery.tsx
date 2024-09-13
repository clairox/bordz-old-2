'use client'
import { useInfiniteQuery } from '@tanstack/react-query'
import { getCollectionQueryOptions } from '@/lib/utils/helpers'

const useCollectionQuery = (handle: string, searchParams: URLSearchParams) => {
    return useInfiniteQuery(getCollectionQueryOptions(handle, searchParams))
}

export default useCollectionQuery
