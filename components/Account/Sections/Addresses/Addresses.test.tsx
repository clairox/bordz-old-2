import Addresses from './Addresses'
import { render } from '@testing-library/react'

describe('Addresses', () => {
	it('renders content correctly', () => {
		const { getByRole } = render(<Addresses />)
		expect(getByRole('heading', { name: 'Shipping Addresses' })).toBeVisible()
	})
})
