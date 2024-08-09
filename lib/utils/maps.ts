export const mapToObject = <K extends string | number | symbol, V>(
	map: Map<K, V>
): Record<K, V> => {
	const obj: Record<K, V> = {} as Record<K, V>
	map.forEach((value, key) => {
		obj[key] = value
	})

	return obj
}
