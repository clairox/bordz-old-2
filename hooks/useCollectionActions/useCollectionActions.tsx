import { queryClient } from '@/lib/clients/queryClient'
import { isValidPriceRange } from '@/lib/core/collections'
import { SEARCH_PARAM_SEPARATOR } from '@/lib/utils/constants'
import _ from 'lodash'
import { useParams, useRouter } from 'next/navigation'
import { useCallback } from 'react'

export const useCollectionActions = (searchParams: URLSearchParams) => {
    const params = useParams()
    const router = useRouter()

    const refine = useCallback(
        (newSearchParams: URLSearchParams) => {
            queryClient.resetQueries({ queryKey: ['getCollection'] })

            const [handle] = params.collection as string[]

            const url = '/' + handle + '?' + newSearchParams.toString()
            router.push(url, { scroll: false })
        },
        [params, router],
    )

    const selectFilterOption = useCallback(
        (groupName: string, optionName: string) => {
            const optionNames = searchParams.get(groupName)
            let updatedOptionNames = optionName

            if (optionNames) {
                updatedOptionNames = optionNames + SEARCH_PARAM_SEPARATOR + optionName
            }

            const newSearchParams = new URLSearchParams(searchParams)

            newSearchParams.set(groupName, updatedOptionNames)

            newSearchParams.delete('cursor')

            refine(newSearchParams)
        },
        [searchParams, refine],
    )

    const deselectFilterOption = useCallback(
        (groupName: string, optionName: string) => {
            const optionNames = searchParams.get(groupName)
            if (optionNames == undefined) {
                refine(searchParams)
                return
            }

            const optionNamesArray = optionNames.split(SEARCH_PARAM_SEPARATOR)
            let updatedOptionNames = optionNamesArray
                .filter(name => name !== optionName)
                .join(SEARCH_PARAM_SEPARATOR)

            const newSearchParams = new URLSearchParams(searchParams)

            if (updatedOptionNames === '') {
                newSearchParams.delete(groupName)
            } else {
                newSearchParams.set(groupName, updatedOptionNames)
            }

            newSearchParams.delete('cursor')

            refine(newSearchParams)
        },
        [searchParams, refine],
    )
    const setPriceFilter = useCallback(
        (priceRange: number[]) => {
            if (!isValidPriceRange(priceRange)) {
                refine(searchParams)
                return
            }

            const newSearchParams = new URLSearchParams(searchParams)
            newSearchParams.set('price', priceRange.join(','))

            newSearchParams.delete('cursor')

            refine(newSearchParams)
        },
        [searchParams, refine],
    )

    const resetFilters = useCallback(() => {
        const keys = Array.from(searchParams.keys())
        const newSearchParams = new URLSearchParams(searchParams)
        keys.forEach(key => {
            if (key !== 'sortBy') {
                newSearchParams.delete(key)
            }
        })

        refine(newSearchParams)
    }, [searchParams, refine])

    return {
        selectFilterOption,
        deselectFilterOption,
        setPriceFilter,
        resetFilters,
    }
}
