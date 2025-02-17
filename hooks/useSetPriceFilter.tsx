import useRefineSearchParams from './useRefineSearchParams'
import { useCallback } from 'react'
import { isValidPriceRange } from '@/lib/core/collections'

const useSetPriceFilter = (searchParams: URLSearchParams) => {
    const refineSearchParams = useRefineSearchParams()

    return useCallback(
        (priceRange: number[]) => {
            if (!isValidPriceRange(priceRange)) {
                refineSearchParams(searchParams)
                return
            }

            const newSearchParams = new URLSearchParams(searchParams)
            newSearchParams.set('price', priceRange.join(','))

            newSearchParams.delete('cursor')

            refineSearchParams(newSearchParams)
        },
        [searchParams, refineSearchParams],
    )
}

export default useSetPriceFilter
