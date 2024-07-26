import { render } from '@testing-library/react'
import AccountAction from './AccountAction'
import userEvent from '@testing-library/user-event'

describe('AccountAction', () => {
	it('renders login menu correctly when customer is not authenticated', async () => {
		const { getByRole, getByTestId } = render(<AccountAction isAuthenticated={false} />)

		await userEvent.click(getByTestId('accountActionButton'))
		expect(getByRole('dialog')).toBeVisible()
		expect(getByRole('heading', { level: 1, name: 'Login' })).toBeVisible()
	})

	it('does not render login menu when customer is authenticated', async () => {
		const { queryByRole, getByTestId } = render(<AccountAction isAuthenticated={true} />)

		await userEvent.click(getByTestId('accountActionButton'))
		expect(queryByRole('dialog')).not.toBeInTheDocument()
		expect(queryByRole('heading', { level: 1, name: 'Login' })).not.toBeInTheDocument()
	})

	it('does not contain link when customer is not authenticated', () => {
		const { queryByRole } = render(<AccountAction isAuthenticated={false} />)

		expect(queryByRole('link')).not.toBeInTheDocument()
	})

	it('links to account page when customer is authenticated', () => {
		const { getByRole } = render(<AccountAction isAuthenticated={true} />)

		expect(getByRole('link')).toHaveAttribute('href', '/account/settings')
	})
})
