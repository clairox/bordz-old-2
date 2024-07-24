import { render } from '@testing-library/react'
import AccountSidebar from './AccountSidebar'

const mocks = vi.hoisted(() => ({
	logout: vi.fn().mockReturnValue({ success: true, data: {}, error: {} }),
}))

vi.mock('@/context/AuthContext/AuthContext', () => ({
	useAuth: vi.fn().mockReturnValue({ user: { firstName: 'Name' }, logout: mocks.logout }),
}))

describe('AccountSidebar', () => {
	it('renders and shows greeting', () => {
		const { getByRole } = render(<AccountSidebar />)
		expect(getByRole('heading', { level: 1, name: 'Hey, Name!' })).toBeVisible()
	})

	it('renders and shows all menu items', () => {
		const { getByRole } = render(<AccountSidebar />)

		expect(getByRole('link', { name: 'My Account' })).toBeVisible()
		expect(getByRole('link', { name: 'Orders' })).toBeVisible()
		expect(getByRole('link', { name: 'Wishlist' })).toBeVisible()
		expect(getByRole('link', { name: 'Shipping Addresses' })).toBeVisible()
		expect(getByRole('link', { name: 'Change Password' })).toBeVisible()
		expect(getByRole('button', { name: 'Logout' })).toBeVisible()
	})

	describe('My Account menu item', () => {
		it('links to settings page', () => {
			const { getByRole } = render(<AccountSidebar />)
			expect(getByRole('link', { name: 'My Account' })).toHaveAttribute('href', '/account/settings')
		})
	})
	describe('Orders menu item', () => {
		it('links to settings page', () => {
			const { getByRole } = render(<AccountSidebar />)
			expect(getByRole('link', { name: 'Orders' })).toHaveAttribute('href', '/account/orders')
		})
	})
	describe('Wishlist menu item', () => {
		it('links to settings page', () => {
			const { getByRole } = render(<AccountSidebar />)
			expect(getByRole('link', { name: 'Wishlist' })).toHaveAttribute('href', '/wishlist')
		})
	})
	describe('Shipping Addresses menu item', () => {
		it('links to settings page', () => {
			const { getByRole } = render(<AccountSidebar />)
			expect(getByRole('link', { name: 'Shipping Addresses' })).toHaveAttribute(
				'href',
				'/account/addresses'
			)
		})
	})
	describe('Change Password menu item', () => {
		it('links to settings page', () => {
			const { getByRole } = render(<AccountSidebar />)
			expect(getByRole('link', { name: 'Change Password' })).toHaveAttribute(
				'href',
				'/account/change-password'
			)
		})
	})
})
