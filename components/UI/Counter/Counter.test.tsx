import { render } from '@testing-library/react'
import { userEvent } from '@testing-library/user-event'
import Counter from './Counter'
import React from 'react'

describe('counter value', () => {
    it('should initialize to 0', () => {
        const { getByRole, unmount } = render(<Counter />)

        expect(getByRole('textbox')).toHaveValue('0')
        unmount()
    })

    it('should initialize with given value', () => {
        const { getByRole, unmount } = render(<Counter value={5} />)

        expect(getByRole('textbox')).toHaveValue('5')
        unmount()
    })

    it('should change according to user text input', async () => {
        const { getByRole, unmount } = render(<Counter />)

        const input = getByRole('textbox')
        await userEvent.type(input, '{backspace}' + '3')
        expect(input).toHaveValue('3')
        unmount()
    })

    it('should not go lower than min value', async () => {
        const { getByRole, unmount } = render(<Counter min={5} />)

        const input = getByRole('textbox')
        await userEvent.type(input, '{backspace}' + '2')

        expect(input).toHaveValue('5')
        unmount()
    })

    it('should not go higher than max value', async () => {
        const { getByRole, unmount } = render(<Counter max={5} />)

        const input = getByRole('textbox')
        await userEvent.type(input, '{backspace}' + '10')

        expect(input).toHaveValue('5')
        unmount()
    })

    it("should only receive number, '', or '-' values ", async () => {
        const { getByRole, unmount } = render(<Counter />)

        const input = getByRole('textbox')

        await userEvent.type(input, '{backspace}')
        expect(input).toHaveValue('')

        await userEvent.type(input, '{backspace}d')
        expect(input).toHaveValue('')

        await userEvent.type(input, '{backspace}-')
        expect(input).toHaveValue('-')

        await userEvent.type(input, '{backspace}a')
        expect(input).toHaveValue('')

        await userEvent.type(input, '{backspace}4')
        expect(input).toHaveValue('4')

        unmount()
    })
})

describe('decrement button', () => {
    it('should decrease value by 1', async () => {
        const { getByRole, getByTestId, unmount } = render(<Counter />)

        const decrementButton = getByTestId('decrementButton')
        await userEvent.click(decrementButton)
        expect(getByRole('textbox')).toHaveValue('-1')

        unmount()
    })

    it('should not decrease value lower than min value', async () => {
        const { getByRole, getByTestId, unmount } = render(<Counter value={5} min={5} />)

        const decrementButton = getByTestId('decrementButton')
        await userEvent.click(decrementButton)
        expect(getByRole('textbox')).not.toHaveValue('4')
        expect(getByRole('textbox')).toHaveValue('5')

        unmount()
    })
})

describe('increment button', () => {
    it('should increase value by 1', async () => {
        const { getByRole, getByTestId, unmount } = render(<Counter />)

        const incrementButton = getByTestId('incrementButton')
        await userEvent.click(incrementButton)
        expect(getByRole('textbox')).toHaveValue('1')

        unmount()
    })

    it('should not increase value higher than max value', async () => {
        const { getByRole, getByTestId, unmount } = render(<Counter value={5} max={5} />)

        const incrementButton = getByTestId('incrementButton')
        await userEvent.click(incrementButton)
        expect(getByRole('textbox')).not.toHaveValue('6')
        expect(getByRole('textbox')).toHaveValue('5')

        unmount()
    })
})
