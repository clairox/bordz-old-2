import { render } from '@testing-library/react'
import Button from './Button'

it('should be disabled if quantity is 0', () => {
	const { getByRole, unmount } = render(<Button id={1} quantity={0} />)
	expect(getByRole('button', { name: 'Add to Bag' })).toBeDisabled()
	unmount()
})

it('should be enabled if quantity is greater than 0', async () => {
	const { getByRole, unmount } = render(<Button id={1} />)
	expect(getByRole('button', { name: 'Add to Bag' })).toBeEnabled()
	unmount()
})
