'use client'
import { restClient } from '@/lib/clients/restClient'
import { useParams } from 'next/navigation'
import _ from 'lodash'
import { useQuery } from '@tanstack/react-query'

const useCollection = (searchParams: URLSearchParams) => {
    const params = useParams()

    // TODO: use infinite query
    const { data, error, isFetching, isSuccess } = useQuery({
        queryKey: ['collection', searchParams.toString()],
        queryFn: async () => {
            const [handle] = params.collection as string[]
            const url = new URL(process.env.NEXT_PUBLIC_API_URL + '/collection')
            url.searchParams.set('handle', handle)

            Array.from(searchParams.entries()).forEach(entry => {
                const [key, value] = entry
                url.searchParams.set(key, value)
            })

            url.searchParams.delete('cursor')

            try {
                const response = await restClient(url.toString())
                return response.data
            } catch (error) {
                throw error
            }
        },
        placeholderData: prevData => prevData,
    })

    return {
        data,
        error,
        isFetching,
        isSuccess,
    }
}

export { useCollection }
