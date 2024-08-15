import { ProductFilterMap } from '@/types'

export const mapToObject = <K extends string | number | symbol, V>(
	map: Map<K, V>
): Record<K, V> => {
	const obj: Record<K, V> = {} as Record<K, V>
	map.forEach((value, key) => {
		obj[key] = value
	})

	return obj
}

export const searchParamsToObject = (searchParams: URLSearchParams): Record<string, string> => {
	return mapToObject(new Map(searchParams))
}

export const productFiltersObjectToMap = (
	filtersObject: Record<string, string[]>
): ProductFilterMap => {
	const filtersMap = new Map()
	Object.keys(filtersObject).forEach(key => {
		filtersMap.set(key, filtersObject[key])
	})

	return filtersMap
}
