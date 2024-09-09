import { SEARCH_PARAM_SEPARATOR } from '@/lib/utils/constants'
import useRefineCollectionSearchParams from './useRefineCollectionSearchParams'
import { useCallback } from 'react'

const useSelectFilterOption = (searchParams: URLSearchParams) => {
    const refineSearchParams = useRefineCollectionSearchParams()

    return useCallback(
        (groupName: string, optionName: string) => {
            const optionNames = searchParams.get(groupName)
            let updatedOptionNames = optionName

            if (optionNames) {
                updatedOptionNames = optionNames + SEARCH_PARAM_SEPARATOR + optionName
            }

            const newSearchParams = new URLSearchParams(searchParams)

            newSearchParams.set(groupName, updatedOptionNames)
            newSearchParams.delete('cursor')

            refineSearchParams(newSearchParams)
        },
        [searchParams, refineSearchParams],
    )
}

export default useSelectFilterOption
