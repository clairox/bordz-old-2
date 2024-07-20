'use client'
import React, { useState } from 'react'
import { ProductFilterMap } from '@/types'
import _ from 'lodash'
import { CollectionSidebarMenu, CollectionSidebarMenuItem } from '../CollectionSidebarMenu'
import PriceRangeSlider from '@/components/PriceRangeSlider'
import CollectionSidebarHeader from '../CollectionSidebarHeader/CollectionSidebarHeader'
import { roundUp } from '@/lib/utils'
import {
	getFiltersFromSearchParams,
	isValidPriceRange,
	mergeProductFilterMaps,
	processPriceParams,
} from '@/lib/collectionUtils'
import { AppRouterInstance } from 'next/dist/shared/lib/app-router-context.shared-runtime'
import { ReadonlyURLSearchParams } from 'next/navigation'

const CollectionSidebar: React.FunctionComponent<{
	availableFilters: ProductFilterMap
	maxPrice: number
	openRefinements: string[]
	setOpenRefinements: (refinements: string[]) => void
	basePath: string
	router: AppRouterInstance
	searchParams: ReadonlyURLSearchParams
}> = ({
	availableFilters,
	maxPrice,
	openRefinements,
	setOpenRefinements,
	basePath,
	router,
	searchParams,
}) => {
	const sortByParam = searchParams.get('sortBy')

	const MIN_PRICE = 0
	const MAX_PRICE = roundUp(maxPrice, 5)

	const priceMinParam = searchParams.get('priceMin')
	const priceMaxParam = searchParams.get('priceMax')

	const selectedPriceFilter = processPriceParams(priceMinParam, priceMaxParam)

	let currentPriceRange: number[] = [MIN_PRICE, MAX_PRICE]
	if (isValidPriceRange(selectedPriceFilter)) {
		currentPriceRange = selectedPriceFilter
	}

	const [renderedPriceRange, setRenderedPriceRange] = useState<number[]>(currentPriceRange)

	const selectedFilters = getFiltersFromSearchParams(searchParams)
	const availableFiltersWithSelectedFilters = mergeProductFilterMaps(
		availableFilters,
		selectedFilters
	)

	const selectNonPriceFilter = (filterKey: string, filterValue: string) => {
		const existingFilterNames = selectedFilters.get(filterKey)
		if (existingFilterNames?.includes(filterValue)) {
			return
		}

		const updatedFilters: ProductFilterMap = new Map(selectedFilters)
		if (existingFilterNames === undefined) {
			updatedFilters.set(filterKey, [filterValue])
		} else {
			const uniqueValues = new Set([...existingFilterNames, filterValue])
			updatedFilters.set(filterKey, Array.from(uniqueValues))
		}

		refine(updatedFilters)
	}

	const deselectNonPriceFilter = (filterKey: string, filterValue: string) => {
		const existingFilterValues = selectedFilters.get(filterKey)
		if (existingFilterValues === undefined || !existingFilterValues.includes(filterValue)) {
			return
		}

		const values = existingFilterValues.filter(value => value !== filterValue)
		const updatedFilters: ProductFilterMap = new Map(selectedFilters)
		if (values.length === 0) {
			updatedFilters.delete(filterKey)
		} else {
			updatedFilters.set(filterKey, values)
		}

		refine(updatedFilters)
	}

	const toggleNonPriceFilter = (
		event: React.ChangeEvent<HTMLInputElement>,
		filterKey: string,
		filterValue: string
	) => {
		const newChecked = event.target.checked
		if (newChecked) {
			return selectNonPriceFilter(filterKey, filterValue)
		}
		return deselectNonPriceFilter(filterKey, filterValue)
	}

	const setPriceFilter = (newPriceRange: number[]) => {
		const [min, max] = newPriceRange

		const updatedFilters: ProductFilterMap = new Map(selectedFilters)
		updatedFilters.set('priceMin', [min.toString()])
		updatedFilters.set('priceMax', [max.toString()])

		refine(updatedFilters)
	}

	const removePriceFilter = () => {
		const updatedFilters: ProductFilterMap = new Map(selectedFilters)
		updatedFilters.delete('priceMin')
		updatedFilters.delete('priceMax')

		refine(updatedFilters)
	}

	const refine = (pendingRefinements: ProductFilterMap) => {
		if (pendingRefinements.size === 0) {
			return router.replace(basePath, { scroll: false })
		}

		const newParams = new URLSearchParams()

		const refinementKeys = Array.from(pendingRefinements.keys())
		refinementKeys.forEach(key => {
			const values = pendingRefinements.get(key)
			newParams.set(key, values!.join('|'))
		})

		if (sortByParam) {
			newParams.set('sortBy', sortByParam)
		}

		const url = newParams.size > 0 ? basePath + '?' + newParams.toString() : basePath
		return router.replace(url, { scroll: false })
	}

	const clearFilters = () => {
		if (sortByParam) {
			const newParams = new URLSearchParams()
			newParams.set('sortBy', sortByParam)
			const url = basePath + '?' + newParams.toString()
			return router.replace(url, { scroll: false })
		}

		return router.replace(basePath, { scroll: false })
	}

	const sortBy = (sortByParam: string) => {
		const newParams = new URLSearchParams(searchParams)
		newParams.set('sortBy', sortByParam)
		newParams.delete('start')

		const url = basePath + '?' + newParams.toString()
		router.replace(url, { scroll: false })
	}

	const makeFilterMenuItemElement = (filterKey: string) => {
		const values = availableFiltersWithSelectedFilters.get(filterKey)
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
										onChange={event => toggleNonPriceFilter(event, filterKey, value)}
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

	return (
		<div>
			<CollectionSidebarHeader
				selectedFilters={selectedFilters}
				priceFilter={selectedPriceFilter}
				clearFilters={clearFilters}
				deselectNonPriceFilter={deselectNonPriceFilter}
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
							renderedValue={renderedPriceRange}
							setRenderedValue={setRenderedPriceRange}
							min={MIN_PRICE}
							max={MAX_PRICE}
						/>
					</div>
				</CollectionSidebarMenuItem>
			</CollectionSidebarMenu>
		</div>
	)
}

export default CollectionSidebar
