import React, { useEffect, useState } from 'react'
import { Slider } from '../ui/Slider'

const RangeSlider: React.FunctionComponent<{
	value: number[]
	setValue: (newValue: number[]) => void
	min: number
	max: number
	step?: number
}> = ({ value, setValue, min, max, step = 5 }) => {
	const [displayValue, setDisplayValue] = useState(value)

	return (
		<div>
			<div className="flex justify-between px-[0.125rem] mb-2 w-full">
				<div>{displayValue[0]}</div>
				<div>{displayValue[1]}</div>
			</div>
			<Slider
				value={displayValue}
				onValueChange={newValue => setDisplayValue(newValue)}
				onValueCommit={newValue => setValue(newValue)}
				step={step}
				minStepsBetweenThumbs={2}
				min={min}
				max={max}
			/>
		</div>
	)
}

export default RangeSlider
