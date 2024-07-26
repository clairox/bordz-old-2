import { render } from '@testing-library/react'
import MiniLoginForm from './MiniLoginForm'
import userEvent from '@testing-library/user-event'

const mocks = vi.hoisted(() => {
	return {
		login: vi.fn(),
		reload: vi.fn(),
	}
})

vi.mock('@/lib/auth', () => ({
	login: mocks.login.mockReturnValue({ success: true }),
}))

describe('MiniLoginForm', () => {
	it('renders and shows header', () => {
		const { getByRole } = render(<MiniLoginForm closePopover={vi.fn()} />)
		expect(getByRole('heading', { level: 1, name: 'Login' })).toBeVisible()
	})

	it('renders and shows email field input', () => {
		const { getByRole } = render(<MiniLoginForm closePopover={vi.fn()} />)
		expect(getByRole('textbox', { name: 'Email' })).toBeVisible()
	})

	it('renders and shows password field input', () => {
		const { getByLabelText } = render(<MiniLoginForm closePopover={vi.fn()} />)
		expect(getByLabelText('Password')).toBeVisible()
	})

	it('renders and shows forgot password link', () => {
		const { getByRole } = render(<MiniLoginForm closePopover={vi.fn()} />)
		expect(getByRole('link', { name: 'Forgot password?' })).toBeVisible()
	})

	it('renders and shows submit button', () => {
		const { getByRole } = render(<MiniLoginForm closePopover={vi.fn()} />)
		expect(getByRole('button', { name: 'Submit' })).toBeVisible()
	})

	it('renders and shows create account link', () => {
		const { getByRole } = render(<MiniLoginForm closePopover={vi.fn()} />)
		expect(getByRole('link', { name: 'Create an account' })).toBeVisible()
	})

	it('calls window.location.reload if all inputs are valid', async () => {
		Object.defineProperty(window, 'location', {
			value: {
				reload: mocks.reload,
			},
			writable: true,
		})

		const { getByRole, getByLabelText } = render(<MiniLoginForm closePopover={vi.fn()} />)

		await userEvent.type(getByRole('textbox', { name: 'Email' }), 'correct@ema.il')
		await userEvent.type(getByLabelText('Password'), 'correctPassword')
		await userEvent.click(getByRole('button', { name: 'Submit' }))

		expect(mocks.reload).toHaveBeenCalled()
	})

	it('renders and shows form error message if user not found', async () => {
		mocks.login.mockReturnValue({ success: false, error: { message: 'Error' } })
		const { getByRole, getByLabelText, getByTestId } = render(
			<MiniLoginForm closePopover={vi.fn()} />
		)

		await userEvent.type(getByRole('textbox', { name: 'Email' }), 'incorrect@ema.il')
		await userEvent.type(getByLabelText('Password'), 'incorrectPassword')
		await userEvent.click(getByRole('button', { name: 'Submit' }))

		expect(getByTestId('formErrorBox')).toBeVisible()
	})

	describe('email field input', () => {
		it('has correct value on input', async () => {
			const { getByRole } = render(<MiniLoginForm closePopover={vi.fn()} />)

			const emailInput = getByRole('textbox', { name: 'Email' })
			await userEvent.type(emailInput, 'test text')

			expect(emailInput).toHaveValue('test text')
		})

		it('has correct error classes if field is empty on submit', async () => {
			const { getByRole } = render(<MiniLoginForm closePopover={vi.fn()} />)

			await userEvent.click(getByRole('button', { name: 'Submit' }))
			expect(getByRole('textbox', { name: 'Email' })).toHaveClass('border-red-500 text-red-500')
		})

		it('renders and shows error message if field is empty on submit', async () => {
			const { getByRole, getByText } = render(<MiniLoginForm closePopover={vi.fn()} />)

			await userEvent.click(getByRole('button', { name: 'Submit' }))
			expect(getByText('Please enter an email address')).toBeVisible()
		})

		it('has correct error classes if input is invalid on submit', async () => {
			const { getByRole } = render(<MiniLoginForm closePopover={vi.fn()} />)

			const emailInput = getByRole('textbox', { name: 'Email' })
			await userEvent.type(emailInput, 'invalid text')

			await userEvent.click(getByRole('button', { name: 'Submit' }))
			expect(emailInput).toHaveClass('border-red-500 text-red-500')
		})

		it('renders and shows error message if input is invalid on submit', async () => {
			const { getByRole, getByText } = render(<MiniLoginForm closePopover={vi.fn()} />)

			await userEvent.type(getByRole('textbox', { name: 'Email' }), 'invalid text')

			await userEvent.click(getByRole('button', { name: 'Submit' }))
			expect(getByText('Invalid email address')).toBeVisible()
		})
	})

	describe('password field input', () => {
		it('has correct value on input', async () => {
			const { getByLabelText } = render(<MiniLoginForm closePopover={vi.fn()} />)

			const passwordInput = getByLabelText('Password')
			await userEvent.type(passwordInput, 'test text')

			expect(passwordInput).toHaveValue('test text')
		})

		it('has correct error classes if field is empty on submit', async () => {
			const { getByRole, getByLabelText } = render(<MiniLoginForm closePopover={vi.fn()} />)

			await userEvent.click(getByRole('button', { name: 'Submit' }))
			expect(getByLabelText('Password')).toHaveClass('border-red-500 text-red-500')
		})

		it('renders and shows error message if field is empty on submit', async () => {
			const { getByRole, getByText } = render(<MiniLoginForm closePopover={vi.fn()} />)

			await userEvent.click(getByRole('button', { name: 'Submit' }))
			expect(getByText('Please enter a password')).toBeVisible()
		})
	})

	describe('forgot password link', () => {
		it('links to correct address', () => {
			const { getByRole } = render(<MiniLoginForm closePopover={vi.fn()} />)
			expect(getByRole('link', { name: 'Forgot password?' })).toHaveAttribute('href', '#')
		})
	})

	//describe('submit button', () => {})

	describe('create account link', () => {
		it('links to correct address', () => {
			const { getByRole } = render(<MiniLoginForm closePopover={vi.fn()} />)
			expect(getByRole('link', { name: 'Create an account' })).toHaveAttribute(
				'href',
				'/login?register=true'
			)
		})
	})
})
