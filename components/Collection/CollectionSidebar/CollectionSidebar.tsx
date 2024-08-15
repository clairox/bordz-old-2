'use client'
import React, { useMemo } from 'react'
import _ from 'lodash'
import { CollectionSidebarMenu, CollectionSidebarMenuItem } from '../CollectionSidebarMenu'
import PriceRangeSlider from '@/components/UI/PriceRangeSlider'
import CollectionSidebarHeader from '../CollectionSidebarHeader/CollectionSidebarHeader'
import { mergeProductFilterMaps } from '@/lib/utils/collection'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import useProductFilters from '@/hooks/useProductFilters'

const CollectionSidebar: React.FunctionComponent<{
	maxPrice: number
	openRefinements: string[]
	setOpenRefinements: (refinements: string[]) => void
}> = ({ maxPrice, openRefinements, setOpenRefinements }) => {
	const {
		filters,
		selectedFilters,
		selectToggleableFilter,
		deselectToggleableFilter,
		updatePriceFilter,
		removePriceFilter,
		clearAllFilters,
		loading,
	} = useProductFilters()
	const minPrice = 0

	const currentPriceRange = useMemo(() => {
		return selectedFilters?.get('price')?.map(value => Number(value)) || [minPrice, maxPrice]
	}, [minPrice, maxPrice, selectedFilters])

	const isPriceFiltered = currentPriceRange[0] > minPrice || currentPriceRange[1] < maxPrice

	const router = useRouter()
	const pathname = usePathname()
	const searchParams = useSearchParams()
	const sortByParam = searchParams.get('sortBy')

	const toggleToggleableFilter = (
		event: React.ChangeEvent<HTMLInputElement>,
		key: string,
		value: string
	) => {
		const newChecked = event.target.checked
		if (newChecked) {
			return selectToggleableFilter(key, value)
		}
		return deselectToggleableFilter(key, value)
	}

	const sortBy = (sortByParam: string) => {
		const newParams = new URLSearchParams(searchParams)
		newParams.set('sortBy', sortByParam)
		newParams.delete('start')

		const url = pathname + '?' + newParams.toString()
		router.replace(url, { scroll: false })
	}

	if (filters == undefined || selectedFilters == undefined) {
		return <div>Loading...</div>
	}

	const makeFilterMenuItemElement = (filterKey: string) => {
		const values = mergeProductFilterMaps(filters, selectedFilters).get(filterKey)
		let menuItemContent = <></>
		if (values && values.length > 0) {
			menuItemContent = (
				<ul className="list-none">
					{values.toSorted().map((value: string) => {
						return (
							<li
								className="pl-6 py-1 hover:underline cursor-pointer"
								key={filterKey + '.' + value}
							>
								<label htmlFor={value + ' checkbox'}>
									<input
										type="checkbox"
										id={value + ' checkbox'}
										checked={selectedFilters.get(filterKey)?.includes(value) || false}
										onChange={event => toggleToggleableFilter(event, filterKey, value)}
									/>
									<span className="pl-2">{value}</span>
								</label>
							</li>
						)
					})}
				</ul>
			)
		}
		return menuItemContent
	}

	const setPriceFilter = (value: number[]) => {
		if (_.isEqual(value, [minPrice, maxPrice])) {
			removePriceFilter()
		} else {
			updatePriceFilter(value)
		}
	}

	return (
		<div>
			<CollectionSidebarHeader
				selectedFilters={selectedFilters}
				isPriceFiltered={isPriceFiltered}
				clearFilters={clearAllFilters}
				deselectToggleableFilter={deselectToggleableFilter}
				removePriceFilter={removePriceFilter}
			/>

			<CollectionSidebarMenu
				openRefinements={openRefinements}
				setOpenRefinements={setOpenRefinements}
			>
				<CollectionSidebarMenuItem title={'Sort'}>
					<div>
						<div className="pl-6 py-1">
							<input
								type="radio"
								className="appearance-none"
								id="sortByRecommended"
								name="sortBy"
								value="recommended"
								checked={sortByParam === 'recommended' || sortByParam === null}
								onChange={e => sortBy(e.target.value)}
							/>
							<label
								className={`${
									sortByParam === 'recommended' || !sortByParam
										? 'font-semibold'
										: 'hover:underline cursor-pointer'
								}`}
								htmlFor="sortByRecommended"
							>
								Recommended
							</label>
						</div>
						<div className="pl-6 py-1">
							<input
								type="radio"
								className="appearance-none"
								id="sortByNewest"
								name="sortBy"
								value="newest"
								checked={sortByParam === 'newest'}
								onChange={e => sortBy(e.target.value)}
							/>
							<label
								className={`${
									sortByParam === 'newest' ? 'font-semibold' : 'hover:underline cursor-pointer'
								}`}
								htmlFor="sortByNewest"
							>
								Newest
							</label>
						</div>
						<div className="pl-6 py-1">
							<input
								type="radio"
								className="appearance-none"
								id="sortByPriceLowToHigh"
								name="sortBy"
								value="priceLowToHigh"
								checked={sortByParam === 'priceLowToHigh'}
								onChange={e => sortBy(e.target.value)}
							/>
							<label
								className={`${
									sortByParam === 'priceLowToHigh'
										? 'font-semibold'
										: 'hover:underline cursor-pointer'
								}`}
								htmlFor="sortByPriceLowToHigh"
							>
								Price: Low to High
							</label>
						</div>
						<div className="pl-6 py-1">
							<input
								type="radio"
								className="appearance-none"
								id="sortByPriceHighToLow"
								name="sortBy"
								value="priceHighToLow"
								checked={sortByParam === 'priceHighToLow'}
								onChange={e => sortBy(e.target.value)}
							/>
							<label
								className={`${
									sortByParam === 'priceHighToLow'
										? 'font-semibold'
										: 'hover:underline cursor-pointer'
								}`}
								htmlFor="sortByPriceHighToLow"
							>
								Price: High to Low
							</label>
						</div>
					</div>
				</CollectionSidebarMenuItem>
				<CollectionSidebarMenuItem title={'Brand'}>
					{makeFilterMenuItemElement('brand')}
				</CollectionSidebarMenuItem>
				<CollectionSidebarMenuItem title={'Size'}>
					{makeFilterMenuItemElement('size')}
				</CollectionSidebarMenuItem>
				<CollectionSidebarMenuItem title={'Color'}>
					{makeFilterMenuItemElement('color')}
				</CollectionSidebarMenuItem>
				<CollectionSidebarMenuItem title={'Price'}>
					<div className="mx-5">
						<PriceRangeSlider
							setValue={setPriceFilter}
							initialValue={currentPriceRange}
							min={minPrice}
							max={maxPrice}
						/>
					</div>
				</CollectionSidebarMenuItem>
			</CollectionSidebarMenu>
		</div>
	)
}

export default CollectionSidebar
