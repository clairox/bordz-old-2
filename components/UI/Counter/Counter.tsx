'use client'
import _ from 'lodash'
import React, { useState, useEffect } from 'react'
import { Input } from '../Input'
import { Minus, Plus } from '@phosphor-icons/react'

type CounterValue = number | '' | '-'

const Counter: React.FunctionComponent<{
	value?: number
	min?: number
	max?: number
	canType?: boolean
	onChange?: (newCount: number) => void
}> = ({ value = 0, min = -Infinity, max = Infinity, canType = true, onChange }) => {
	value = _.clamp(value, min, max)
	const [count, setCount] = useState(value)
	const [inputValue, setInputValue] = useState<CounterValue>(value)

	useEffect(() => {
		setCount(value)
		setInputValue(value)
	}, [value])

	const setCounterValue = async (count: number) => {
		if (onChange) {
			await onChange(count)
		}

		setCount(count)
		setInputValue(count)
	}

	const handleIncrement = () => {
		if (count < max) {
			const newCount = count + 1
			setCounterValue(newCount)
		}
	}

	const handleDecrement = () => {
		if (count > min) {
			const newCount = count - 1
			setCounterValue(newCount)
		}
	}

	const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		if (!canType) {
			return
		}

		if (event.target.value === '' || /^\s*$/.test(event.target.value)) {
			setInputValue('')
			return
		}

		if (event.target.value === '-') {
			setInputValue('-')
			return
		}

		const valueAsNumber = Number(event.target.value)

		if (isNaN(valueAsNumber)) {
			return
		}

		const valueAsInt = _.toSafeInteger(valueAsNumber)
		const newCount = _.clamp(valueAsInt, min, max)
		setInputValue(newCount)
	}

	const handleBlur = (event: React.FocusEvent<HTMLInputElement>) => {
		if (inputValue === '' || inputValue === '-') {
			const newCount = min > 0 ? min : 0
			setCounterValue(newCount)
			return
		}

		setCounterValue(Number(event.target.value))
	}

	// const triggerChange = (newValue: number | '') => {
	// 	const inputElement = inputRef.current
	// 	if (inputElement === null) {
	// 		return
	// 	}

	// 	const nativeInputValueSetter = Object.getOwnPropertyDescriptor(
	// 		window.HTMLInputElement.prototype,
	// 		'value'
	// 	)?.set
	// 	if (nativeInputValueSetter === undefined) {
	// 		return
	// 	}

	// 	nativeInputValueSetter.call(inputElement, newValue)
	// 	const event = new Event('input', { bubbles: true })
	// 	inputElement.dispatchEvent(event)
	// }

	return (
		<div className="flex flex-row h-8">
			<button
				data-testid="decrementButton"
				className="flex justify-center items-center w-8 border border-black"
				onClick={handleDecrement}
			>
				<Minus size={15} weight={'regular'} />
			</button>
			<div>
				<Input
					pattern=""
					className="px-1 w-10 h-8 border-l-0 border-r-0 text-center text-base"
					type="text"
					value={inputValue}
					onChange={handleChange}
					onBlur={handleBlur}
				/>
			</div>
			<button
				data-testid="incrementButton"
				className="flex justify-center items-center w-8 border border-black"
				onClick={handleIncrement}
			>
				<Plus size={15} weight={'regular'} />
			</button>
		</div>
	)
}

export default Counter
