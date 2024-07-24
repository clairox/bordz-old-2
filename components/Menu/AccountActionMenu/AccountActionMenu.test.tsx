import { render } from '@testing-library/react'
import AccountActionMenu from './AccountActionMenu'
import userEvent from '@testing-library/user-event'

const logout = vi.fn()

const user = {
	id: 'userId',
	email: 'email@ema.il',
	firstName: 'First',
	lastName: 'Last',
	displayName: 'First Last',
}

describe('AccountActionMenu', () => {
	it('renders and shows greeting', () => {
		const { getByRole } = render(<AccountActionMenu user={user} handleLogout={logout} />)
		expect(getByRole('heading', { level: 1, name: 'Hey, First!' })).toBeVisible()
	})

	it('renders and shows all menu items', () => {
		const { getByRole } = render(<AccountActionMenu user={user} handleLogout={logout} />)

		expect(getByRole('link', { name: 'My Account' })).toBeVisible()
		expect(getByRole('link', { name: 'Orders' })).toBeVisible()
		expect(getByRole('button', { name: 'Logout' })).toBeVisible()
	})

	describe('My Account menu item', () => {
		it('links to settings page', () => {
			const { getByRole } = render(<AccountActionMenu user={user} handleLogout={logout} />)
			expect(getByRole('link', { name: 'My Account' })).toHaveAttribute('href', '/account/settings')
		})
	})
	describe('Orders menu item', () => {
		it('links to settings page', () => {
			const { getByRole } = render(<AccountActionMenu user={user} handleLogout={logout} />)
			expect(getByRole('link', { name: 'Orders' })).toHaveAttribute('href', '/account/orders')
		})
	})

	describe('Logout menu item', () => {
		it('calls logout', async () => {
			const { getByRole } = render(<AccountActionMenu user={user} handleLogout={logout} />)
			await userEvent.click(getByRole('button', { name: 'Logout' }))
			expect(logout).toHaveBeenCalled()
		})
	})
})
