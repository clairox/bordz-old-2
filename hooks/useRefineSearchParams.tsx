import { useQueryClient } from '@tanstack/react-query'
import { useParams, useRouter } from 'next/navigation'
import { useCallback } from 'react'

const useRefineSearchParams = () => {
    const params = useParams()
    const router = useRouter()

    const queryClient = useQueryClient()
    return useCallback(
        (newSearchParams: URLSearchParams) => {
            let queryKey = params.collection ? ['getCollection'] : ['getSearch']
            queryClient.resetQueries({ queryKey })

            const url = window.location.pathname + '?' + newSearchParams.toString()
            router.push(url, { scroll: false })
        },
        [params, router, queryClient],
    )
}

export default useRefineSearchParams
