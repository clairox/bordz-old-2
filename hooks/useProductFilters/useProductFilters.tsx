import { fetcher } from '@/lib/fetcher'
import { ProductFilterMap } from '@/types'
import { useParams, usePathname, useRouter } from 'next/navigation'
import { useCallback, useEffect, useRef, useState } from 'react'
import useSearchParamsObject from '../useSearchParamsObject'
import { productFiltersObjectToMap } from '@/lib/utils/conversions'
import _ from 'lodash'

const useProductFilters = () => {
	const [filters, setFilters] = useState<ProductFilterMap | undefined>(undefined)
	const [selectedFilters, setSelectedFilters] = useState<ProductFilterMap | undefined>(undefined)
	const [loading, setLoading] = useState(true)

	const router = useRouter()
	const pathname = usePathname()
	const params = useParams()
	const searchParams = useSearchParamsObject()

	const currentSearchParams = useRef(searchParams)

	const loadFilters = useCallback(async () => {
		const [handle, subcategory] = params.collection as string[]

		let url = `/collection/filters?handle=${handle}`
		if (subcategory) {
			url += `&subcategory=${subcategory}`
		}
		Object.keys(searchParams).forEach(key => (url += `&${key}=${searchParams[key]}`))

		try {
			const response = await fetcher(url)

			const { productFilters, selectedProductFilters } = response.data

			setFilters(productFiltersObjectToMap(productFilters))
			setSelectedFilters(productFiltersObjectToMap(selectedProductFilters))
			setLoading(false)
		} catch (error) {
			// TODO 500
		}
	}, [params.collection, searchParams])

	useEffect(() => {
		if (filters == undefined || !_.isEqual(searchParams, currentSearchParams.current)) {
			currentSearchParams.current = searchParams
			loadFilters()
		}
	}, [loadFilters, filters, searchParams])

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
			updatedSearchParams.delete('limit')

			const refinementKeys = Array.from(pendingRefinements.keys())
			refinementKeys.forEach(key => {
				const values = pendingRefinements.get(key)
				updatedSearchParams.set(key, values!.join(','))
			})

			setLoading(true)
			const url =
				updatedSearchParams.size > 0 ? pathname + '?' + updatedSearchParams.toString() : pathname
			router.replace(url, { scroll: false })
		},
		[filters, pathname, router, searchParams]
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
		[refine, selectedFilters]
	)

	const deselectToggleableFilter = useCallback(
		(key: string, value: string) => {
			if (selectedFilters == undefined) {
				return
			}

			const selectedFilterValuesForKey = selectedFilters.get(key)
			if (selectedFilterValuesForKey == undefined || !selectedFilterValuesForKey.includes(value)) {
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
		[refine, selectedFilters]
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
		[refine, selectedFilters]
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
		updatedSearchParams.delete('limit')

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
