'use client'
import React from 'react'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import {
	RefinementsRoot,
	RefinementsItem,
} from '@/components/ProductRefinements/ProductRefinements'

const CollectionSidebar: React.FunctionComponent<{
	brands: string[]
	sizes: string[]
	colors: string[]
}> = ({ brands, sizes, colors }) => {
	const PARAM_DELIMITER = '|'

	const router = useRouter()
	const pathname = usePathname()
	const searchParams = useSearchParams()

	const brandRefinements = searchParams.get('brand')?.split(PARAM_DELIMITER) || []
	const sizeRefinements = searchParams.get('size')?.split(PARAM_DELIMITER) || []
	const colorRefinements = searchParams.get('color')?.split(PARAM_DELIMITER) || []
	const hasRefinements =
		brandRefinements.length > 0 || sizeRefinements.length > 0 || colorRefinements.length > 0

	const toggleBrandRefinement = (brand: string) => {
		const newBrandRefinements = brandRefinements.includes(brand)
			? brandRefinements.filter(refinement => refinement !== brand)
			: [...brandRefinements, brand]

		refine({ brand: newBrandRefinements, size: sizeRefinements, color: colorRefinements })
	}

	const toggleSizeRefinement = (size: string) => {
		const newSizeRefinements = sizeRefinements.includes(size)
			? sizeRefinements.filter(refinement => refinement !== size)
			: [...sizeRefinements, size]

		refine({ brand: brandRefinements, size: newSizeRefinements, color: colorRefinements })
	}

	const toggleColorRefinement = (color: string) => {
		const newColorRefinements = colorRefinements.includes(color)
			? colorRefinements.filter(refinement => refinement !== color)
			: [...colorRefinements, color]

		refine({ brand: brandRefinements, size: sizeRefinements, color: newColorRefinements })
	}

	type Refinements = {
		brand: string[]
		size: string[]
		color: string[]
	}

	const refine = (refinements: Refinements) => {
		const { brand, size, color } = refinements
		const newParams = new URLSearchParams()
		if (brand.length > 0) {
			newParams.set('brand', brand.join(PARAM_DELIMITER))
		}

		if (size.length > 0) {
			newParams.set('size', size.join(PARAM_DELIMITER))
		}

		if (color.length > 0) {
			newParams.set('color', color.join(PARAM_DELIMITER))
		}

		const url = newParams.size > 0 ? pathname + '?' + newParams.toString() : pathname
		router.replace(url, { scroll: false })
		router.refresh()
	}

	const clearRefinements = () => {
		router.push(pathname)
		router.refresh()
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
				{brandRefinements.length > 0 && (
					<ul className="flex flex-wrap gap-2 pt-2 list-none">
						{brandRefinements.map(brand => {
							return (
								<li
									className="cursor-pointer hover:underline"
									key={brand}
									onClick={() => toggleBrandRefinement(brand)}
								>
									x {brand}
								</li>
							)
						})}
					</ul>
				)}
				{sizeRefinements.length > 0 && (
					<ul className="flex flex-wrap gap-2 pt-2 list-none">
						{sizeRefinements.map(size => {
							return (
								<li
									className="cursor-pointer hover:underline"
									key={size}
									onClick={() => toggleSizeRefinement(size)}
								>
									x {size}
								</li>
							)
						})}
					</ul>
				)}
				{colorRefinements.length > 0 && (
					<ul className="flex flex-wrap gap-2 pt-2 list-none">
						{colorRefinements.map(color => {
							return (
								<li
									className="cursor-pointer hover:underline"
									key={color}
									onClick={() => toggleColorRefinement(color)}
								>
									x {color}
								</li>
							)
						})}
					</ul>
				)}
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
				<RefinementsItem title={'Brand'}>
					<ul className="list-none">
						{brands.map((brand: string) => {
							return (
								<li className="pl-6 py-1 hover:underline cursor-pointer" key={brand}>
									<label htmlFor={brand + ' checkbox'}>
										<input
											type="checkbox"
											id={brand + ' checkbox'}
											checked={brandRefinements.includes(brand)}
											onChange={() => toggleBrandRefinement(brand)}
										/>
										<span className="pl-2">{brand}</span>
									</label>
								</li>
							)
						})}
					</ul>
				</RefinementsItem>
				<RefinementsItem title={'Size'}>
					<ul className="list-none">
						{sizes.map((size: string) => {
							return (
								<li className="pl-6 py-1 hover:underline cursor-pointer" key={size}>
									<label htmlFor={size + ' checkbox'}>
										<input
											type="checkbox"
											id={size + ' checkbox'}
											checked={sizeRefinements.includes(size)}
											onChange={() => toggleSizeRefinement(size)}
										/>
										<span className="pl-2">{size}</span>
									</label>
								</li>
							)
						})}
					</ul>
				</RefinementsItem>
				<RefinementsItem title={'Color'}>
					<ul className="list-none">
						{colors.map((color: string) => {
							return (
								<li className="pl-6 py-1 hover:underline cursor-pointer" key={color}>
									<label htmlFor={color + ' checkbox'}>
										<input
											type="checkbox"
											id={color + ' checkbox'}
											checked={colorRefinements.includes(color)}
											onChange={() => toggleColorRefinement(color)}
										/>
										<span className="pl-2">{color}</span>
									</label>
								</li>
							)
						})}
					</ul>
				</RefinementsItem>
				<RefinementsItem title={'Price'}></RefinementsItem>
			</RefinementsRoot>
		</div>
	)
}

export default CollectionSidebar

// TODO: !! Sorting
// TODO: !! Filter by color and price
