import { restClient } from '@/lib/services/clients/restClient'
import { ProductFilterMap } from '@/types'
import { useParams, usePathname, useRouter } from 'next/navigation'
import { useCallback, useEffect, useRef, useState } from 'react'
import { productFiltersObjectToMap, searchParamsToObject } from '@/lib/utils/conversions'
import _ from 'lodash'

const useProductFilters = (searchParams: URLSearchParams) => {
    const [filters, setFilters] = useState<ProductFilterMap | undefined>(undefined)
    const [selectedFilters, setSelectedFilters] = useState<ProductFilterMap | undefined>(undefined)
    const [loading, setLoading] = useState(true)

    const router = useRouter()
    const pathname = usePathname()
    const params = useParams()

    const currentSearchParams = useRef<Record<string, string>>({})

    const loadFilters = useCallback(async () => {
        const [handle, subcategory] = params.collection as string[]

        let url = `/collection/filters?handle=${handle}`
        if (subcategory) {
            url += `&subcategory=${subcategory}`
        }
        Object.keys(currentSearchParams.current).forEach(
            key => (url += `&${key}=${currentSearchParams.current[key]}`),
        )

        try {
            const response = await restClient(url)

            const { productFilters, selectedProductFilters } = response.data

            setFilters(productFiltersObjectToMap(productFilters))
            setSelectedFilters(productFiltersObjectToMap(selectedProductFilters))
            setLoading(false)
        } catch (error) {
            // TODO: 500
        }
    }, [params.collection])

    useEffect(() => {
        if (!_.isEqual(searchParams, currentSearchParams.current)) {
            currentSearchParams.current = searchParamsToObject(searchParams)
            loadFilters()
        }
    }, [loadFilters, searchParams])

    const refine = useCallback(
        (pendingRefinements: ProductFilterMap) => {
            if (filters == undefined) {
                return
            }

            if (pendingRefinements.size === 0) {
                router.replace(pathname, { scroll: false })
                setLoading(true)
                return
            }

            const updatedSearchParams = new URLSearchParams(searchParams)
            Array.from(filters.keys()).forEach(key => updatedSearchParams.delete(key))
            updatedSearchParams.delete('start')

            const refinementKeys = Array.from(pendingRefinements.keys())
            refinementKeys.forEach(key => {
                const values = pendingRefinements.get(key)
                updatedSearchParams.set(key, values!.join(','))
            })

            setLoading(true)
            const url =
                updatedSearchParams.size > 0
                    ? pathname + '?' + updatedSearchParams.toString()
                    : pathname
            router.replace(url, { scroll: false })
        },
        [filters, pathname, router, searchParams],
    )

    const selectToggleableFilter = useCallback(
        (key: string, value: string) => {
            if (selectedFilters == undefined) {
                return
            }

            const selectedFilterValuesForKey = selectedFilters.get(key)
            if (selectedFilterValuesForKey?.includes(value)) {
                return
            }

            const updatedFilters: ProductFilterMap = new Map(selectedFilters)
            if (selectedFilterValuesForKey == undefined) {
                updatedFilters.set(key, [value])
            } else {
                const uniqueSelectedFilterValues = new Set([...selectedFilterValuesForKey, value])
                updatedFilters.set(key, Array.from(uniqueSelectedFilterValues))
            }

            refine(updatedFilters)
        },
        [refine, selectedFilters],
    )

    const deselectToggleableFilter = useCallback(
        (key: string, value: string) => {
            if (selectedFilters == undefined) {
                return
            }

            const selectedFilterValuesForKey = selectedFilters.get(key)
            if (
                selectedFilterValuesForKey == undefined ||
                !selectedFilterValuesForKey.includes(value)
            ) {
                return
            }

            const values = selectedFilterValuesForKey.filter(filterValue => filterValue !== value)
            const updatedFilters: ProductFilterMap = new Map(selectedFilters)
            if (values.length === 0) {
                updatedFilters.delete(key)
            } else {
                updatedFilters.set(key, values)
            }

            refine(updatedFilters)
        },
        [refine, selectedFilters],
    )

    const updatePriceFilter = useCallback(
        (priceRange: number[]) => {
            if (selectedFilters == undefined) {
                return
            }

            const updatedFilters: ProductFilterMap = new Map(selectedFilters)
            updatedFilters.set('price', [priceRange[0].toString(), priceRange[1].toString()])

            refine(updatedFilters)
        },
        [refine, selectedFilters],
    )

    const removePriceFilter = useCallback(() => {
        if (selectedFilters == undefined) {
            return
        }

        const updatedFilters: ProductFilterMap = new Map(selectedFilters)
        updatedFilters.delete('price')

        refine(updatedFilters)
    }, [refine, selectedFilters])

    const clearAllFilters = useCallback(() => {
        if (filters == undefined) {
            return
        }

        const updatedSearchParams = new URLSearchParams(searchParams)
        Array.from(filters.keys()).forEach(key => updatedSearchParams.delete(key))
        updatedSearchParams.delete('start')

        const url = pathname + '?' + updatedSearchParams.toString()
        router.replace(url, { scroll: false })
    }, [filters, pathname, router, searchParams])

    return {
        filters,
        selectedFilters,
        selectToggleableFilter,
        deselectToggleableFilter,
        updatePriceFilter,
        removePriceFilter,
        clearAllFilters,
        loading,
    }
}

export default useProductFilters
