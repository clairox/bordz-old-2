import { render } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import CartButton from './CartButton'

describe('cart button', () => {
	it('should open cart sheet when clicked', async () => {
		const { getByRole, unmount } = render(<CartButton />)

		await userEvent.click(getByRole('button'))
		expect(getByRole('dialog')).toBeVisible()
	})
})
