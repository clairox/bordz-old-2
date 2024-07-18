'use client'
import React, { useState } from 'react'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { ProductFilter } from '@/types'
import _ from 'lodash'
import { CollectionSidebarMenu, CollectionSidebarMenuItem } from '../CollectionSidebarMenu'
import PriceRangeSlider from '@/components/PriceRangeSlider'
import CollectionSidebarHeader from '../CollectionSidebarHeader/CollectionSidebarHeader'
import { roundUp } from '@/lib/utils'
import { getSearchParamValues, isValidPriceRange, processPriceParams } from '@/lib/collectionUtils'

const CollectionSidebar: React.FunctionComponent<{
	productFilters: ProductFilter[]
	maxPrice: number
	openRefinements: string[]
	setOpenRefinements: (refinements: string[]) => void
}> = ({ productFilters, maxPrice, openRefinements, setOpenRefinements }) => {
	const router = useRouter()
	const basePath = usePathname()
	const searchParams = useSearchParams()

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

	const getFilterNamesFromSearchParams = (params: URLSearchParams): string[] => {
		const keys = Array.from(params.keys())
		const filterNames = productFilters.map(productFilter => productFilter.label)
		return keys.filter(key => filterNames.includes(key))
	}

	const selectedFilters = getFilterNamesFromSearchParams(searchParams).map(filterName => ({
		label: filterName,
		values: getSearchParamValues(searchParams.get(filterName)),
	}))

	const toggleRefinement = (type: string, filterName: string) => {
		const refinementType = selectedFilters.find(refinement => refinement.label === type)

		const newRefinementType = {
			label: type,
			values: [] as string[],
		}

		if (refinementType) {
			if (refinementType.values?.includes(filterName)) {
				newRefinementType.values = [...refinementType.values.filter(value => value !== filterName)]
			} else {
				newRefinementType.values = [...(refinementType.values || []), filterName]
			}
		} else {
			newRefinementType.values = [filterName]
		}

		const newRefinements = [
			...selectedFilters.filter(refinement => refinement.label !== type),
			...(newRefinementType.values.length > 0 ? [newRefinementType] : []),
		]

		if (newRefinements.length > 0) {
			refine(newRefinements)
		} else {
			clearRefinements()
		}
	}

	const setPriceRefinement = (newPriceRange: number[]) => {
		const [min, max] = newPriceRange

		const newRefinements = [
			...selectedFilters.filter(
				refinement => refinement.label !== 'priceMin' && refinement.label !== 'priceMax'
			),
			{ label: 'priceMin', values: [min.toString()] },
			{ label: 'priceMax', values: [max.toString()] },
		]

		refine(newRefinements)
	}

	const deletePriceRefinement = () => {
		const newRefinements = [
			...selectedFilters.filter(
				refinement => refinement.label !== 'priceMin' && refinement.label !== 'priceMax'
			),
		]

		if (newRefinements.length > 0) {
			refine(newRefinements)
		} else {
			clearRefinements()
		}
	}

	const refine = (refinements: { label: string; values: string[] }[]) => {
		const newParams = new URLSearchParams()
		refinements.forEach(refinement => {
			const name = refinement.label
			const value = refinement.values.join('|')
			newParams.set(name, value)
		})

		if (sortByParam) {
			newParams.set('sortBy', sortByParam)
		}

		const url = newParams.size > 0 ? basePath + '?' + newParams.toString() : basePath
		router.replace(url, { scroll: false })
	}

	const clearRefinements = () => {
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

		const url = basePath + '?' + newParams.toString()
		router.replace(url, { scroll: false })
	}

	return (
		<div>
			<CollectionSidebarHeader
				selectedRefinements={selectedFilters}
				priceRefinement={selectedPriceFilter}
				clearRefinements={clearRefinements}
				toggleRefinement={toggleRefinement}
				deletePriceRefinement={deletePriceRefinement}
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
				{productFilters.map(filter => {
					const { label, values } = filter
					return (
						<CollectionSidebarMenuItem title={_.capitalize(label)} key={label}>
							<ul className="list-none">
								{values.toSorted().map((value: string) => {
									return (
										<li
											className="pl-6 py-1 hover:underline cursor-pointer"
											key={label + '.' + value}
										>
											<label htmlFor={value + ' checkbox'}>
												<input
													type="checkbox"
													id={value + ' checkbox'}
													checked={
														selectedFilters
															.find(refinement => refinement.label === label)
															?.values.includes(value) || false
													}
													onChange={() => toggleRefinement(label, value)}
												/>
												<span className="pl-2">{value}</span>
											</label>
										</li>
									)
								})}
							</ul>
						</CollectionSidebarMenuItem>
					)
				})}
				<CollectionSidebarMenuItem title={'Price'}>
					<div className="mx-5">
						<PriceRangeSlider
							setValue={setPriceRefinement}
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

// TODO: !! addRefinement() and removeRefinement() functions
// TODO: Figure out how to pass hook values from parent component without it causing issues
