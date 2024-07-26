import { render } from '@testing-library/react'
import Orders from './Orders'

describe('Orders', () => {
	it('renders content correctly', () => {
		const { getByRole } = render(<Orders />)
		expect(getByRole('heading', { name: 'Orders' })).toBeVisible()
	})
})
