import { render } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import DeleteAccountForm from './DeleteAccountForm'

const mocks = vi.hoisted(() => {
	return {
		push: vi.fn(),
		login: vi.fn(),
		logout: vi.fn(),
		fetch: vi.fn(),
	}
})

vi.mock('next/navigation', () => ({
	useRouter: vi.fn().mockReturnValue({ push: mocks.push }),
	usePathname: vi.fn().mockReturnValue('/account/delete-account'),
}))

vi.mock('@/lib/auth', () => ({
	login: mocks.login.mockReturnValue({ success: true }),
	logout: mocks.logout.mockReturnValue({ success: true }),
}))

global.fetch = mocks.fetch.mockReturnValue({ status: 200, ok: true })

const email = 'test@ema.il'

describe('DeleteAccountForm', () => {
	it('renders and shows all fields', () => {
		const { getByLabelText } = render(<DeleteAccountForm customerEmail={email} />)

		expect(getByLabelText('Confirm Password')).toBeVisible()
	})

	it('calls router.push with correct value when fetch returns with 401 status', async () => {
		mocks.fetch.mockReturnValueOnce({ status: 401 })
		const { getByRole, getByLabelText } = render(<DeleteAccountForm customerEmail={email} />)

		await userEvent.type(getByLabelText('Confirm Password'), 'testpassword')
		await userEvent.click(getByRole('button', { name: 'Delete Account' }))

		expect(mocks.push).toHaveBeenCalledWith(
			'/login?redirect=%2Faccount%2Fdelete-account&reason=session_expired'
		)
	})

	it('renders and shows formErrorBox if password check fails', async () => {
		mocks.login.mockReturnValueOnce({ success: false })
		const { getByRole, getByLabelText, getByTestId } = render(
			<DeleteAccountForm customerEmail={email} />
		)

		await userEvent.type(getByLabelText('Confirm Password'), 'testpassword')
		await userEvent.click(getByRole('button', { name: 'Delete Account' }))
		expect(getByTestId('formErrorBox')).toBeVisible()
	})

	describe('confirm password field input', () => {
		it('has correct value on input', async () => {
			const { getByLabelText } = render(<DeleteAccountForm customerEmail={email} />)

			const passwordInput = getByLabelText('Confirm Password')
			await userEvent.type(passwordInput, 'test text')

			expect(passwordInput).toHaveValue('test text')
		})

		it('has correct error classes if field is empty on submit', async () => {
			const { getByRole, getByLabelText } = render(<DeleteAccountForm customerEmail={email} />)

			await userEvent.click(getByRole('button', { name: 'Delete Account' }))
			expect(getByLabelText('Confirm Password')).toHaveClass('border-red-500 text-red-500')
		})

		it('renders and shows error message if field is empty on submit', async () => {
			const { getByRole, getByText } = render(<DeleteAccountForm customerEmail={email} />)

			await userEvent.click(getByRole('button', { name: 'Delete Account' }))
			expect(getByText('Please enter your password')).toBeVisible()
		})
	})
})
