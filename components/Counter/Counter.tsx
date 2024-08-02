'use client'
import React, { useRef } from 'react'

const Counter: React.FunctionComponent<{
	defaultValue?: number
	value?: number | ''
	minValue?: number
	maxValue?: number
	decrement?: () => void
	increment?: () => void
	setValue: (value: number | '') => void
	onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void
	onBlur?: (event: React.FocusEvent<HTMLInputElement>) => void
}> = ({ value = 1, minValue, maxValue, increment, decrement, setValue, onChange, onBlur }) => {
	const inputRef = useRef<HTMLInputElement>(null)

	const handleDecrement = () => {
		if (decrement) {
			return decrement()
		}

		if (minValue !== undefined && +value <= minValue) {
			return setValue(minValue)
		}

		setValue(+value - 1)
		// if (inputRef.current === null) {
		// 	return
		// }

		// const inputElement = inputRef.current
		// const newValue = +inputElement.value - 1

		// if (minValue !== undefined && newValue < minValue) {
		// 	return triggerChange(minValue)
		// }

		// return triggerChange(newValue)
	}
	const handleIncrement = () => {
		if (increment) {
			return increment()
		}

		if (maxValue !== undefined && +value >= maxValue) {
			return setValue(maxValue)
		}

		setValue(+value + 1)
		// if (inputRef.current === null) {
		// 	return
		// }

		// const inputElement = inputRef.current
		// const newValue = +inputElement.value + 1

		// if (maxValue !== undefined && newValue > maxValue) {
		// 	return triggerChange(maxValue)
		// }

		// return triggerChange(newValue)
	}

	const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		if (onChange) {
			return onChange(event)
		}

		if (event.target.value === '' || /^\s*$/.test(event.target.value)) {
			return setValue('')
		}

		const newValue = +event.target.value

		if (isNaN(newValue)) {
			return
		}

		if (minValue !== undefined && newValue < minValue) {
			return setValue(minValue)
		} else if (maxValue !== undefined && newValue > maxValue) {
			return setValue(maxValue)
		}

		setValue(newValue)
		// if (event.target.value === '' || /^\s*$/.test(event.target.value)) {
		// 	return setTextValue('')
		// }
		// const newValue = +event.target.value
		// if (isNaN(newValue)) {
		// 	return
		// }
		// if (minValue !== undefined && newValue < minValue) {
		// 	return setTextValue(minValue.toString())
		// } else if (maxValue !== undefined && newValue > maxValue) {
		// 	return setTextValue(maxValue.toString())
		// }
		// return setTextValue(newValue.toString())
	}

	const handleBlur = (event: React.FocusEvent<HTMLInputElement>) => {
		if (onBlur) {
			return onBlur(event)
		}

		if (minValue !== undefined && value === '') {
			setValue(minValue)
		}
	}

	const triggerChange = (newValue: number | '') => {
		const inputElement = inputRef.current
		if (inputElement === null) {
			return
		}

		const nativeInputValueSetter = Object.getOwnPropertyDescriptor(
			window.HTMLInputElement.prototype,
			'value'
		)?.set
		if (nativeInputValueSetter === undefined) {
			return
		}

		nativeInputValueSetter.call(inputElement, newValue)
		const event = new Event('input', { bubbles: true })
		inputElement.dispatchEvent(event)
	}

	return (
		<div className="flex flex-row">
			<button onClick={handleDecrement}>
				<span>-</span>
			</button>
			<div>
				<input
					pattern=""
					className="w-6"
					type="text"
					value={value}
					onChange={handleChange}
					onBlur={handleBlur}
					ref={inputRef}
				/>
			</div>
			<button onClick={handleIncrement}>
				<span>+</span>
			</button>
		</div>
	)
}

export default Counter
