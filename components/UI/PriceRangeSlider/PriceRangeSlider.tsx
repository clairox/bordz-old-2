'use client'
import React, { useEffect, useMemo, useState } from 'react'
import { roundUp } from '@/lib/utils/number'
import _ from 'lodash'
import { Slider } from '../Slider'
import { useSetPriceFilter } from '@/hooks'
import { useSearchParams } from 'next/navigation'

const PriceRangeSlider: React.FunctionComponent<{
    initialValue: number[]
    min: number
    max: number
    step?: number
}> = ({ initialValue, min, max, step = 5 }) => {
    const [renderedValue, setRenderedValue] = useState(initialValue)
    const [minSelectedValue, maxSelectedValue] = useMemo(() => renderedValue, [renderedValue])

    const searchParams = useSearchParams()
    const setValue = useSetPriceFilter(searchParams)

    useEffect(() => {
        setRenderedValue(initialValue)
    }, [initialValue])

    const roundedMaxSelectedValue = roundUp(maxSelectedValue, step)

    return (
        <div>
            <div className="flex justify-between px-[0.125rem] mb-2 w-full">
                <div>${minSelectedValue}</div>
                <div>${roundedMaxSelectedValue}</div>
            </div>
            <Slider
                value={renderedValue}
                onValueChange={newValue => setRenderedValue(newValue)}
                onValueCommit={newValue => setValue(newValue)}
                step={step}
                minStepsBetweenThumbs={1}
                min={min}
                max={max}
                data-testid="slider"
            />
        </div>
    )
}

export default PriceRangeSlider
