'use client'
import React from 'react'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import {
	RefinementsRoot,
	RefinementsItem,
} from '@/components/ProductRefinements/ProductRefinements'
import { ProductFilter } from '@/types'
import _ from 'lodash'

const CollectionSidebar: React.FunctionComponent<{
	filters: ProductFilter[]
}> = ({ filters }) => {
	const PARAM_DELIMITER = '|'

	const router = useRouter()
	const pathname = usePathname()
	const searchParams = useSearchParams()

	const currentRefinements = Array.from(searchParams.keys())
		.filter(key => filters.map(filter => filter.label).includes(key))
		.map(key => ({
			label: key,
			values: searchParams.get(key)?.split(PARAM_DELIMITER) || [],
		}))

	const hasRefinements = currentRefinements.length > 0

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
		// Using '?u-true' circumvents Page component not rerendering
		// after navigating to url without query params
		router.replace(pathname + '?u=true', { scroll: false })
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
			</div>
			<RefinementsRoot>
				<RefinementsItem title={'Sort'}>
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
				</RefinementsItem>
				{filters.map(filter => {
					const { label, values } = filter
					return (
						<RefinementsItem title={_.capitalize(label)} key={label}>
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
						</RefinementsItem>
					)
				})}
				<RefinementsItem title={'Price'}></RefinementsItem>
			</RefinementsRoot>
		</div>
	)
}

export default CollectionSidebar

// TODO: !! Sorting
// TODO: !! Filter by price
// TODO: !! addRefinement() and removeRefinement() functions
// TODO: Prevent AccordionItem from closing when refining
