import { SEARCH_PARAM_SEPARATOR } from '@/lib/utils/constants'
import useRefineCollectionSearchParams from './useRefineCollectionSearchParams'
import { useCallback } from 'react'

const useDeselectFilterOption = (searchParams: URLSearchParams) => {
    const refineSearchParams = useRefineCollectionSearchParams()

    return useCallback(
        (groupName: string, optionName: string) => {
            const optionNames = searchParams.get(groupName)
            if (optionNames == undefined) {
                refineSearchParams(searchParams)
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

            refineSearchParams(newSearchParams)
        },
        [searchParams, refineSearchParams],
    )
}

export default useDeselectFilterOption
