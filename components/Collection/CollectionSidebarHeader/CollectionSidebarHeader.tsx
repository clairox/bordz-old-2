import { FilterTag } from '@/types'

const CollectionSidebarHeader: React.FunctionComponent<{
    filterTags: FilterTag[]
    clearFilters: () => void
    unsetFilter: (key: string, value: string | string[]) => void
}> = ({ filterTags, clearFilters, unsetFilter }) => {
    const hasFilters = filterTags.length > 0

    const handleFilterTagClick = (key: string, value: string | string[]) => {
        unsetFilter(key, value)
    }

    const makeFilterTagsByKey = (key: string) => {
        const tags = filterTags.filter(tag => tag.key === key)
        if (tags.length === 0) {
            return <></>
        }

        return (
            <ul className="flex flex-wrap gap-2 pt-2 list-none" key={key}>
                {tags.map(tag => {
                    // TODO: use icon for label x
                    return (
                        <li
                            className="cursor-pointer hover:underline"
                            key={tag.key + '.' + tag.value}
                            onClick={() => handleFilterTagClick(tag.key, tag.value)}
                        >
                            x {tag.label}
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
            {makeFilterTagsByKey('brand')}
            {makeFilterTagsByKey('size')}
            {makeFilterTagsByKey('color')}
            {makeFilterTagsByKey('price')}
        </div>
    )
}

export default CollectionSidebarHeader
// import React from 'react'
//
// const CollectionSidebarHeader: React.FunctionComponent<{
// 	selectedFilters: ProductFilterMap
// 	isPriceFiltered: boolean
// 	clearFilters: () => void
// 	deselectToggleableFilter: (filterKey: string, filterValue: string) => void
// 	removePriceFilter: () => void
// }> = ({
// 	selectedFilters,
// 	isPriceFiltered,
// 	clearFilters,
// 	deselectToggleableFilter,
// 	removePriceFilter,
// }) => {
// 	const hasFilters = selectedFilters.size > 0 || isPriceFiltered
//
// 	const handleFilterClick = (key: string, value: string) => deselectToggleableFilter(key, value)
//
// 	const makeSelectedFilterListElementByKey = (filterKey: string) => {
// 		const values = selectedFilters.get(filterKey)
// 		if (values === undefined || values.length === 0) {
// 			return <></>
// 		}
//
// 		return (
// 			<ul className="flex flex-wrap gap-2 pt-2 list-none" key={filterKey}>
// 				{values.map(value => {
// 					return (
// 						<li
// 							className="cursor-pointer hover:underline"
// 							key={filterKey + '.' + value}
// 							onClick={() => handleFilterClick(filterKey, value)}
// 						>
// 							x {value}
// 						</li>
// 					)
// 				})}
// 			</ul>
// 		)
// 	}
//
// 	return (
// 		<div className="px-5 py-4 border-b border-black">
// 			<div className="flex justify-between">
// 				<div className="font-semibold">Refine By:</div>
// 				{hasFilters && (
// 					<button className="underline cursor-pointer" onClick={clearFilters}>
// 						Reset
// 					</button>
// 				)}
// 			</div>
// 			{makeSelectedFilterListElementByKey('brand')}
// 			{makeSelectedFilterListElementByKey('size')}
// 			{makeSelectedFilterListElementByKey('color')}
// 			{isPriceFiltered && (
// 				<div className="pt-2 cursor-pointer hover:underline" onClick={() => removePriceFilter()}>
// 					x ${selectedFilters.get('price')?.[0]} - ${selectedFilters.get('price')?.[1]}
// 				</div>
// 			)}
// 		</div>
// 	)
// }
//
// export default CollectionSidebarHeader
