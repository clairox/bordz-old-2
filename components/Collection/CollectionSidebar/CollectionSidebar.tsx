'use client'
import React, { useState } from 'react'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { ProductFilter } from '@/types'
import _ from 'lodash'
import { CollectionSidebarMenu, CollectionSidebarMenuItem } from '../CollectionSidebarMenu'
import PriceRangeSlider from '@/components/PriceRangeSlider'
import CollectionSidebarHeader from '../CollectionSidebarHeader/CollectionSidebarHeader'

const CollectionSidebar: React.FunctionComponent<{
	filters: ProductFilter[]
	maxPrice: number
	openRefinements: string[]
	setOpenRefinements: (refinements: string[]) => void
}> = ({ filters, maxPrice, openRefinements, setOpenRefinements }) => {
	const PARAM_DELIMITER = '|'

	const router = useRouter()
	const pathname = usePathname()
	const searchParams = useSearchParams()

	const sortByParam = searchParams.get('sortBy')

	const MIN_PRICE = 0
	const MAX_PRICE = maxPrice
	const minPriceParam = searchParams.get('priceMin')
	const maxPriceParam = searchParams.get('priceMax')
	const minRenderedPrice = +(minPriceParam || MIN_PRICE)
	const maxRenderedPrice = +(maxPriceParam || MAX_PRICE)

	const [renderedPriceRange, setRenderedPriceRange] = useState<number[]>([
		minRenderedPrice,
		maxRenderedPrice,
	])

	const selectedRefinements = Array.from(searchParams.keys())
		.filter(key => filters.map(filter => filter.label).includes(key))
		.map(key => ({
			label: key,
			values: searchParams.get(key)?.split(PARAM_DELIMITER) || [],
		}))

	const toggleRefinement = (type: string, filterName: string) => {
		const refinementType = selectedRefinements.find(refinement => refinement.label === type)

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
			...selectedRefinements.filter(refinement => refinement.label !== type),
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
			...selectedRefinements.filter(
				refinement => refinement.label !== 'priceMin' && refinement.label !== 'priceMax'
			),
			{ label: 'priceMin', values: [min.toString()] },
			{ label: 'priceMax', values: [max.toString()] },
		]

		refine(newRefinements)
	}

	const deletePriceRefinement = () => {
		const newRefinements = [
			...selectedRefinements.filter(
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
			const value = refinement.values.join(PARAM_DELIMITER)
			newParams.set(name, value)
		})

		if (sortByParam) {
			newParams.set('sortBy', sortByParam)
		}

		const url = newParams.size > 0 ? pathname + '?' + newParams.toString() : pathname
		router.replace(url, { scroll: false })
	}

	const clearRefinements = () => {
		if (sortByParam) {
			const newParams = new URLSearchParams()
			newParams.set('sortBy', sortByParam)
			const url = pathname + '?' + newParams.toString()
			return router.replace(url, { scroll: false })
		}

		return router.replace(pathname, { scroll: false })
	}

	const sortBy = (sortByParam: string) => {
		const newParams = new URLSearchParams(searchParams)
		newParams.set('sortBy', sortByParam)

		const url = pathname + '?' + newParams.toString()
		router.replace(url, { scroll: false })
	}

	return (
		<div>
			<CollectionSidebarHeader
				selectedRefinements={selectedRefinements}
				priceRefinement={
					minPriceParam && maxPriceParam ? [minPriceParam, maxPriceParam] : undefined
				}
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
				{filters.map(filter => {
					const { label, values } = filter
					return (
						<CollectionSidebarMenuItem title={_.capitalize(label)} key={label}>
							<ul className="list-none">
								{values.map((value: string) => {
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
														selectedRefinements
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
