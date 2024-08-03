import React from 'react'
import { Slider } from '@/components/UI/Slider'

const RangeSlider: React.FunctionComponent<{
	setValue: (newValue: number[]) => void
	renderedValue: number[]
	setRenderedValue: (newValue: number[]) => void
	min: number
	max: number
	step?: number
}> = ({ setValue, renderedValue, setRenderedValue, min, max, step = 5 }) => {
	return (
		<Slider
			value={renderedValue}
			onValueChange={newValue => setRenderedValue(newValue)}
			onValueCommit={newValue => setValue(newValue)}
			step={step}
			minStepsBetweenThumbs={2}
			min={min}
			max={max}
			data-testid="slider"
		/>
	)
}

export default RangeSlider
