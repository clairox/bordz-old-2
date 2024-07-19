import { isValidPriceRange } from '@/lib/collectionUtils'
import { ProductFilterMap } from '@/types'
import React from 'react'

const CollectionSidebarHeader: React.FunctionComponent<{
	selectedFilters: ProductFilterMap
	priceFilter: number[]
	clearFilters: () => void
	deselectNonPriceFilter: (filterKey: string, filterValue: string) => void
	removePriceFilter: () => void
}> = ({
	selectedFilters,
	priceFilter = [],
	clearFilters,
	deselectNonPriceFilter,
	removePriceFilter,
}) => {
	const hasFilters = selectedFilters.size > 0 || isValidPriceRange(priceFilter)

	const handleFilterClick = (key: string, value: string) => deselectNonPriceFilter(key, value)

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
			{isValidPriceRange(priceFilter) && (
				<div className="pt-2 cursor-pointer hover:underline" onClick={() => removePriceFilter()}>
					x ${priceFilter[0]} - ${priceFilter[1]}
				</div>
			)}
		</div>
	)
}

export default CollectionSidebarHeader
