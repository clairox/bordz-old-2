import { render } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import CartAction from './CartAction'

describe('cart button', () => {
	it('should open cart sheet when clicked', async () => {
		const { getByRole, unmount } = render(<CartAction />)

		await userEvent.click(getByRole('button'))
		expect(getByRole('dialog')).toBeVisible()
	})
})
