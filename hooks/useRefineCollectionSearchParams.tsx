import { useQueryClient } from '@tanstack/react-query'
import { useParams, useRouter } from 'next/navigation'
import { useCallback } from 'react'

const useRefineCollectionSearchParams = () => {
    const params = useParams()
    const router = useRouter()

    const queryClient = useQueryClient()
    return useCallback(
        (newSearchParams: URLSearchParams) => {
            queryClient.resetQueries({ queryKey: ['getCollection'] })

            const [handle] = params.collection as string[]

            const url = '/' + handle + '?' + newSearchParams.toString()
            router.push(url, { scroll: false })
        },
        [params, router, queryClient],
    )
}

export default useRefineCollectionSearchParams
