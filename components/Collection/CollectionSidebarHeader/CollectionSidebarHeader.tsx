import React from 'react'

type Refinement = {
	label: string
	values: string[]
}

const CollectionSidebarHeader: React.FunctionComponent<{
	selectedRefinements: Refinement[]
	priceRefinement?: string[]
	clearRefinements: () => void
	toggleRefinement: (label: string, value: string) => void
	deletePriceRefinement: () => void
}> = ({
	selectedRefinements,
	priceRefinement = [],
	clearRefinements,
	toggleRefinement,
	deletePriceRefinement,
}) => {
	const [minPrice, maxPrice] = priceRefinement
	const hasRefinements = selectedRefinements.length > 0 || priceRefinement.length === 2
	
	return (
		<div className="px-5 py-4 border-b border-black">
			<div className="flex justify-between">
				<div className="font-semibold">Refine By:</div>
				{hasRefinements && (
					<button className="underline cursor-pointer" onClick={clearRefinements}>
						Reset
					</button>
				)}
			</div>
			{selectedRefinements.length > 0 &&
				selectedRefinements.map(refinementType => {
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
			{minPrice && maxPrice && (
				<div
					className="pt-2 cursor-pointer hover:underline"
					onClick={() => deletePriceRefinement()}
				>
					x ${minPrice} - ${maxPrice}
				</div>
			)}
		</div>
	)
}

export default CollectionSidebarHeader
