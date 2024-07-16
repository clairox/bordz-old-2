'use client'
import React, { useEffect, useState } from 'react'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { ProductFilter } from '@/types'
import _ from 'lodash'
import { CollectionSidebarMenu, CollectionSidebarMenuItem } from '../CollectionSidebarMenu'
import PriceRangeSlider from '@/components/PriceRangeSlider'

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

	const currentRefinements = Array.from(searchParams.keys())
		.filter(key => filters.map(filter => filter.label).includes(key))
		.map(key => ({
			label: key,
			values: searchParams.get(key)?.split(PARAM_DELIMITER) || [],
		}))

	const hasRefinements = currentRefinements.length > 0 || minPriceParam || maxPriceParam

	const toggleRefinement = (type: string, filterName: string) => {
		const refinementType = currentRefinements.find(refinement => refinement.label === type)

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
			...currentRefinements.filter(refinement => refinement.label !== type),
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
			...currentRefinements.filter(
				refinement => refinement.label !== 'priceMin' && refinement.label !== 'priceMax'
			),
			{ label: 'priceMin', values: [min.toString()] },
			{ label: 'priceMax', values: [max.toString()] },
		]

		refine(newRefinements)
	}

	const deletePriceRefinement = () => {
		const newRefinements = [
			...currentRefinements.filter(
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

		const url = newParams.size > 0 ? pathname + '?' + newParams.toString() : pathname
		router.replace(url, { scroll: false })
	}

	const clearRefinements = () => {
		router.replace(pathname, { scroll: false })
	}

	return (
		<div>
			<div className="px-5 py-4 border-b border-black">
				<div className="flex justify-between">
					<div className="font-semibold">Refine By:</div>
					{hasRefinements && (
						<button className="underline cursor-pointer" onClick={clearRefinements}>
							Reset
						</button>
					)}
				</div>
				{currentRefinements.length > 0 &&
					currentRefinements.map(refinementType => {
						const { label, values } = refinementType
						return (
							<ul className="flex flex-wrap gap-2 pt-2 list-none" key={label}>
								{values.map(value => {
									return (
										<li
											className="cursor-pointer hover:underline"
											key={label + '.' + value}
											onClick={() => toggleRefinement(label, value)}
										>
											x {value}
										</li>
									)
								})}
							</ul>
						)
					})}
				{minPriceParam && maxPriceParam && (
					<div className="cursor-pointer hover:underline" onClick={() => deletePriceRefinement()}>
						x ${minPriceParam} - ${maxPriceParam}
					</div>
				)}
			</div>

			<CollectionSidebarMenu
				openRefinements={openRefinements}
				setOpenRefinements={setOpenRefinements}
			>
				<CollectionSidebarMenuItem title={'Sort'}>
					<ul className="list-none">
						<li className="pl-6 py-1 hover:underline cursor-pointer">
							<p>Recommended</p>
						</li>
						<li className="pl-6 py-1 hover:underline cursor-pointer">
							<p className="font-semibold">Newest</p>
						</li>
						<li className="pl-6 py-1 hover:underline cursor-pointer">
							<p>Price: Low to High</p>
						</li>
						<li className="pl-6 py-1 hover:underline cursor-pointer">
							<p>Price: High to Low</p>
						</li>
					</ul>
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
														currentRefinements
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

// TODO: !! Sorting
// TODO: !! Filter by price
// TODO: !! addRefinement() and removeRefinement() functions
