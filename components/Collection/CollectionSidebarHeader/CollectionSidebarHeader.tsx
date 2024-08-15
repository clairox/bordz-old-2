import { ProductFilterMap } from '@/types'
import React from 'react'

const CollectionSidebarHeader: React.FunctionComponent<{
	selectedFilters: ProductFilterMap
	isPriceFiltered: boolean
	clearFilters: () => void
	deselectToggleableFilter: (filterKey: string, filterValue: string) => void
	removePriceFilter: () => void
}> = ({
	selectedFilters,
	isPriceFiltered,
	clearFilters,
	deselectToggleableFilter,
	removePriceFilter,
}) => {
	const hasFilters = selectedFilters.size > 0 || isPriceFiltered

	const handleFilterClick = (key: string, value: string) => deselectToggleableFilter(key, value)

	const makeSelectedFilterListElementByKey = (filterKey: string) => {
		const values = selectedFilters.get(filterKey)
		if (values === undefined || values.length === 0) {
			return <></>
		}

		return (
			<ul className="flex flex-wrap gap-2 pt-2 list-none" key={filterKey}>
				{values.map(value => {
					return (
						<li
							className="cursor-pointer hover:underline"
							key={filterKey + '.' + value}
							onClick={() => handleFilterClick(filterKey, value)}
						>
							x {value}
						</li>
					)
				})}
			</ul>
		)
	}

	return (
		<div className="px-5 py-4 border-b border-black">
			<div className="flex justify-between">
				<div className="font-semibold">Refine By:</div>
				{hasFilters && (
					<button className="underline cursor-pointer" onClick={clearFilters}>
						Reset
					</button>
				)}
			</div>
			{makeSelectedFilterListElementByKey('brand')}
			{makeSelectedFilterListElementByKey('size')}
			{makeSelectedFilterListElementByKey('color')}
			{isPriceFiltered && (
				<div className="pt-2 cursor-pointer hover:underline" onClick={() => removePriceFilter()}>
					x ${selectedFilters.get('price')?.[0]} - ${selectedFilters.get('price')?.[1]}
				</div>
			)}
		</div>
	)
}

export default CollectionSidebarHeader
