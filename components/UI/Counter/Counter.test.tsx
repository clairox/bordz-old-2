import { render } from '@testing-library/react'
import { userEvent } from '@testing-library/user-event'
import Counter from './Counter'
import React, { useState } from 'react'

describe('counter value', () => {
	it('should initialize to 1', () => {
		const CounterWrapper: React.FunctionComponent = () => {
			const updateValue = (value: number | '') => {}
			return <Counter setValue={updateValue} />
		}
		const { getByRole, unmount } = render(<CounterWrapper />)

		expect(getByRole('textbox')).toHaveValue('1')
		unmount()
	})

	it('should initialize with given value', () => {
		const CounterWrapper: React.FunctionComponent = () => {
			const [value, setValue] = useState<number | ''>(5)
			const updateValue = (newValue: number | '') => {}
			return <Counter value={value} setValue={updateValue} />
		}
		const { getByRole, unmount } = render(<CounterWrapper />)

		expect(getByRole('textbox')).toHaveValue('5')
		unmount()
	})

	it('should change according to user input', async () => {
		const CounterWrapper: React.FunctionComponent = () => {
			const [value, setValue] = useState<number | ''>(1)
			const updateValue = (newValue: number | '') => {
				setValue(newValue)
			}
			return <Counter value={value} setValue={updateValue} />
		}
		const { getByRole, unmount } = render(<CounterWrapper />)

		const inputValue = '3'
		const expectedValue = inputValue

		const input = getByRole('textbox')
		await userEvent.type(input, '{backspace}' + inputValue)
		expect(input).toHaveValue(expectedValue)
		unmount()
	})

	it('should not go lower than min value', async () => {
		const minValue = 5
		const CounterWrapper: React.FunctionComponent = () => {
			const [value, setValue] = useState<number | ''>(1)
			const updateValue = (newValue: number | '') => {
				setValue(newValue)
			}
			return <Counter value={value} setValue={updateValue} minValue={minValue} />
		}
		const { getByRole, unmount } = render(<CounterWrapper />)

		const inputValueLowerThanMinValue = '2'
		const expectedValue = minValue.toString()

		const input = getByRole('textbox')
		await userEvent.type(input, '{backspace}' + inputValueLowerThanMinValue)

		expect(input).toHaveValue(expectedValue)
		unmount()
	})

	it('should not go higher than max value', async () => {
		const maxValue = 5
		const CounterWrapper: React.FunctionComponent = () => {
			const [value, setValue] = useState<number | ''>(1)
			const updateValue = (newValue: number | '') => {
				setValue(newValue)
			}
			return <Counter value={value} setValue={updateValue} maxValue={maxValue} />
		}
		const { getByRole, unmount } = render(<CounterWrapper />)

		const inputValueHigherThanMaxValue = '10'
		const expectedValue = maxValue.toString()

		const input = getByRole('textbox')
		await userEvent.type(input, '{backspace}' + inputValueHigherThanMaxValue)

		expect(input).toHaveValue(expectedValue)
		unmount()
	})

	it('should only receive number or empty string values', async () => {
		const CounterWrapper: React.FunctionComponent = () => {
			const [value, setValue] = useState<number | ''>(1)
			const updateValue = (newValue: number | '') => {
				setValue(newValue)
			}
			return <Counter value={value} setValue={updateValue} />
		}
		const { getByRole, unmount } = render(<CounterWrapper />)

		const input = getByRole('textbox')

		await userEvent.type(input, '{backspace}')
		expect(input).toHaveValue('')

		await userEvent.type(input, 'd')
		expect(input).toHaveValue('')

		await userEvent.type(input, '-')
		expect(input).toHaveValue('')

		await userEvent.type(input, '4')
		expect(input).toHaveValue('4')

		unmount()
	})
})

describe('decrement button', () => {
	it('should decrease value by 1', async () => {
		const CounterWrapper: React.FunctionComponent = () => {
			const [value, setValue] = useState<number | ''>(5)
			const updateValue = (newValue: number | '') => {
				setValue(newValue)
			}
			return <Counter value={value} setValue={updateValue} />
		}
		const { getByRole, unmount } = render(<CounterWrapper />)

		const decrementButton = getByRole('button', { name: '-' })
		await userEvent.click(decrementButton)
		expect(getByRole('textbox')).toHaveValue('4')

		unmount()
	})

	it('should not decrease value lower than min value', async () => {
		const minValue = 5
		const CounterWrapper: React.FunctionComponent = () => {
			const [value, setValue] = useState<number | ''>(5)
			const updateValue = (newValue: number | '') => {
				setValue(newValue)
			}
			return <Counter value={value} setValue={updateValue} minValue={minValue} />
		}
		const { getByRole, unmount } = render(<CounterWrapper />)

		const decrementButton = getByRole('button', { name: '-' })
		await userEvent.click(decrementButton)
		expect(getByRole('textbox')).not.toHaveValue('4')
		expect(getByRole('textbox')).toHaveValue('5')

		unmount()
	})
})

describe('increment button', () => {
	it('should increase value by 1', async () => {
		const CounterWrapper: React.FunctionComponent = () => {
			const [value, setValue] = useState<number | ''>(5)
			const updateValue = (newValue: number | '') => {
				setValue(newValue)
			}
			return <Counter value={value} setValue={updateValue} />
		}
		const { getByRole, unmount } = render(<CounterWrapper />)

		const incrementButton = getByRole('button', { name: '+' })
		await userEvent.click(incrementButton)
		expect(getByRole('textbox')).toHaveValue('6')

		unmount()
	})

	it('should not increase value higher than max value', async () => {
		const maxValue = 5
		const CounterWrapper: React.FunctionComponent = () => {
			const [value, setValue] = useState<number | ''>(5)
			const updateValue = (newValue: number | '') => {
				setValue(newValue)
			}
			return <Counter value={value} setValue={updateValue} maxValue={maxValue} />
		}
		const { getByRole, unmount } = render(<CounterWrapper />)

		const incrementButton = getByRole('button', { name: '+' })
		await userEvent.click(incrementButton)
		expect(getByRole('textbox')).not.toHaveValue('6')
		expect(getByRole('textbox')).toHaveValue('5')

		unmount()
	})
})
