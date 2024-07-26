import { render } from '@testing-library/react'
import AccountSidebar from './AccountSidebar'

vi.mock('next/navigation', () => ({
	useRouter: vi.fn().mockReturnValue({ replace: vi.fn() }),
}))

describe('AccountSidebar', () => {
	it('renders and shows greeting', () => {
		const { getByRole } = render(<AccountSidebar customerFirstName={'Name'} />)
		expect(getByRole('heading', { level: 1, name: 'Hey, Name!' })).toBeVisible()
	})

	it('renders and shows all menu items', () => {
		const { getByRole } = render(<AccountSidebar customerFirstName={'Name'} />)

		expect(getByRole('link', { name: 'Settings' })).toBeVisible()
		expect(getByRole('link', { name: 'Orders' })).toBeVisible()
		expect(getByRole('link', { name: 'Personal Info' })).toBeVisible()
		expect(getByRole('link', { name: 'Wishlist' })).toBeVisible()
		expect(getByRole('link', { name: 'Shipping Addresses' })).toBeVisible()
		expect(getByRole('link', { name: 'Change Password' })).toBeVisible()
		expect(getByRole('button', { name: 'Logout' })).toBeVisible()
	})

	describe('Settings menu item', () => {
		it('links to settings page', () => {
			const { getByRole } = render(<AccountSidebar customerFirstName={'Name'} />)
			expect(getByRole('link', { name: 'Settings' })).toHaveAttribute('href', '/account/settings')
		})
	})
	describe('Orders menu item', () => {
		it('links to orders page', () => {
			const { getByRole } = render(<AccountSidebar customerFirstName={'Name'} />)
			expect(getByRole('link', { name: 'Orders' })).toHaveAttribute('href', '/account/orders')
		})
	})
	describe('Personal Info menu item', () => {
		it('links to personal info page', () => {
			const { getByRole } = render(<AccountSidebar customerFirstName={'Name'} />)
			expect(getByRole('link', { name: 'Personal Info' })).toHaveAttribute(
				'href',
				'/account/personal-info'
			)
		})
	})
	describe('Wishlist menu item', () => {
		it('links to wishlist page', () => {
			const { getByRole } = render(<AccountSidebar customerFirstName={'Name'} />)
			expect(getByRole('link', { name: 'Wishlist' })).toHaveAttribute('href', '/wishlist')
		})
	})
	describe('Shipping Addresses menu item', () => {
		it('links to addresses page', () => {
			const { getByRole } = render(<AccountSidebar customerFirstName={'Name'} />)
			expect(getByRole('link', { name: 'Shipping Addresses' })).toHaveAttribute(
				'href',
				'/account/addresses'
			)
		})
	})
	describe('Change Password menu item', () => {
		it('links to change password page', () => {
			const { getByRole } = render(<AccountSidebar customerFirstName={'Name'} />)
			expect(getByRole('link', { name: 'Change Password' })).toHaveAttribute(
				'href',
				'/account/change-password'
			)
		})
	})

	describe.skip('Logout menu item')
})
