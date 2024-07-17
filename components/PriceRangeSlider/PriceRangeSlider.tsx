import React from 'react'
import RangeSlider from '../RangeSlider'

const roundUp = (value: number, to: number) => Math.ceil(value / to) * to

const PriceRangeSlider: React.FunctionComponent<{
	setValue: (newValue: number[]) => void
	renderedValue: number[]
	setRenderedValue: (newValue: number[]) => void
	min: number
	max: number
	step?: number
}> = ({ setValue, renderedValue, setRenderedValue, min, max, step = 5 }) => {
	let [minSelectedValue, maxSelectedValue] = renderedValue
	const roundedMaxSelectedValue = roundUp(maxSelectedValue, step)

	return (
		<div>
			<div className="flex justify-between px-[0.125rem] mb-2 w-full">
				<div>${minSelectedValue}</div>
				<div>${roundedMaxSelectedValue}</div>
			</div>
			<RangeSlider
				setValue={setValue}
				renderedValue={[minSelectedValue, roundedMaxSelectedValue]}
				setRenderedValue={setRenderedValue}
				min={min}
				max={max}
				step={step}
			/>
		</div>
	)
}

export default PriceRangeSlider
