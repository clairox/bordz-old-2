import { render } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import DeleteAccountForm from './DeleteAccountForm'

vi.mock('next/navigation', () => ({
	useRouter: vi.fn().mockReturnValue({ replace: vi.fn() }),
}))

describe('DeleteAccountForm', () => {
	it('renders and shows all fields', () => {
		const { getByLabelText } = render(<DeleteAccountForm />)

		expect(getByLabelText('Confirm Password')).toBeVisible()
	})

	describe('confirm password field input', () => {
		it('has correct value on input', async () => {
			const { getByLabelText } = render(<DeleteAccountForm />)

			const passwordInput = getByLabelText('Confirm Password')
			await userEvent.type(passwordInput, 'test text')

			expect(passwordInput).toHaveValue('test text')
		})

		it('has correct error classes if field is empty on submit', async () => {
			const { getByRole, getByLabelText } = render(<DeleteAccountForm />)

			await userEvent.click(getByRole('button', { name: 'Delete Account' }))
			expect(getByLabelText('Confirm Password')).toHaveClass('border-red-500 text-red-500')
		})

		it('renders and shows error message if field is empty on submit', async () => {
			const { getByRole, getByText } = render(<DeleteAccountForm />)

			await userEvent.click(getByRole('button', { name: 'Delete Account' }))
			expect(getByText('Please enter your password')).toBeVisible()
		})
	})
})
