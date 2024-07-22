import { render } from '@testing-library/react'
import SignupForm from './SignupForm'
import userEvent from '@testing-library/user-event'

const mocks = vi.hoisted(() => {
	return {
		signup: vi.fn(),
	}
})

vi.mock('@/context/AuthContext/AuthContext', () => ({
	useAuth: vi.fn().mockReturnValue({ signup: mocks.signup }),
}))

describe('SignupForm', () => {
	it('renders and shows header', () => {
		const { getByRole } = render(<SignupForm />)
		expect(getByRole('heading', { level: 1, name: 'Sign Up' })).toBeVisible()
	})

	it('renders and shows all fields', () => {
		const { getByRole, getByLabelText, getByTestId } = render(<SignupForm />)

		expect(getByRole('textbox', { name: 'First Name' })).toBeVisible()
		expect(getByRole('textbox', { name: 'Last Name' })).toBeVisible()
		expect(getByTestId('monthSelect')).toBeVisible()
		expect(getByTestId('daySelect')).toBeVisible()
		expect(getByTestId('yearSelect')).toBeVisible()
		expect(getByRole('textbox', { name: 'Email' })).toBeVisible()
		expect(getByLabelText('Password')).toBeVisible()
	})

	it('renders and shows submit button', () => {
		const { getByRole } = render(<SignupForm />)
		expect(getByRole('button', { name: 'Submit' })).toBeVisible()
	})

	it('renders and shows log in link', () => {
		const { getByRole } = render(<SignupForm />)
		expect(getByRole('link', { name: 'Log in' })).toBeVisible()
	})

	it.skip('renders and shows form error message if..............', async () => {
		mocks.signup.mockReturnValue({ error: { field: undefined, message: 'Error' } })
		const { getByRole, getByLabelText, getByTestId } = render(<SignupForm />)

		await userEvent.type(getByRole('textbox', { name: 'Email' }), 'incorrect@ema.il')
		await userEvent.type(getByLabelText('Password'), 'incorrectPassword')
		await userEvent.click(getByRole('button', { name: 'Submit' }))

		expect(getByTestId('formErrorBox')).toBeVisible()
	})

	describe('first name input', () => {
		it('has correct value on input', async () => {
			const { getByRole } = render(<SignupForm />)

			const firstNameInput = getByRole('textbox', { name: 'First Name' })
			await userEvent.type(firstNameInput, 'test text')

			expect(firstNameInput).toHaveValue('test text')
		})

		it('has correct error classes if field is empty on submit', async () => {
			const { getByRole } = render(<SignupForm />)

			await userEvent.click(getByRole('button', { name: 'Submit' }))
			expect(getByRole('textbox', { name: 'First Name' })).toHaveClass(
				'border-red-500 text-red-500'
			)
		})

		it('renders and shows error message if field is empty on submit', async () => {
			const { getByRole, getByText } = render(<SignupForm />)

			await userEvent.click(getByRole('button', { name: 'Submit' }))
			expect(getByText('Please enter your first name')).toBeVisible()
		})

		it('has correct error classes if input length is greater than 50 on submit', async () => {
			const { getByRole, getByText } = render(<SignupForm />)

			const text = 'test string that is longer than the accepted length of 50'
			const firstNameInput = getByRole('textbox', { name: 'First Name' })
			await userEvent.type(firstNameInput, text)
			await userEvent.click(getByRole('button', { name: 'Submit' }))

			expect(firstNameInput).toHaveClass('border-red-500 text-red-500')
		})

		it('renders and shows error message if input length is greater than 50 on submit', async () => {
			const { getByRole, getByText } = render(<SignupForm />)

			const text = 'test string that is longer than the accepted length of 50'
			await userEvent.type(getByRole('textbox', { name: 'First Name' }), text)
			await userEvent.click(getByRole('button', { name: 'Submit' }))

			expect(getByText('First name must not exceed 50 characters')).toBeVisible
		})
	})

	describe('last name input', () => {
		it('has correct value on input', async () => {
			const { getByRole } = render(<SignupForm />)

			const lastNameInput = getByRole('textbox', { name: 'Last Name' })
			await userEvent.type(lastNameInput, 'test text')

			expect(lastNameInput).toHaveValue('test text')
		})

		it('has correct error classes if field is empty on submit', async () => {
			const { getByRole } = render(<SignupForm />)

			await userEvent.click(getByRole('button', { name: 'Submit' }))
			expect(getByRole('textbox', { name: 'Last Name' })).toHaveClass('border-red-500 text-red-500')
		})

		it('renders and shows error message if field is empty on submit', async () => {
			const { getByRole, getByText } = render(<SignupForm />)

			await userEvent.click(getByRole('button', { name: 'Submit' }))
			expect(getByText('Please enter your last name')).toBeVisible()
		})

		it('has correct error classes if input length is greater than 50 on submit', async () => {
			const { getByRole, getByText } = render(<SignupForm />)

			const text = 'test string that is longer than the accepted length of 50'
			const lastNameInput = getByRole('textbox', { name: 'Last Name' })
			await userEvent.type(lastNameInput, text)
			await userEvent.click(getByRole('button', { name: 'Submit' }))

			expect(lastNameInput).toHaveClass('border-red-500 text-red-500')
		})

		it('renders and shows error message if input length is greater than 50 on submit', async () => {
			const { getByRole, getByText } = render(<SignupForm />)

			const text = 'test string that is longer than the accepted length of 50'
			await userEvent.type(getByRole('textbox', { name: 'Last Name' }), text)
			await userEvent.click(getByRole('button', { name: 'Submit' }))

			expect(getByText('Last name must not exceed 50 characters')).toBeVisible
		})
	})

	describe.skip('date of birth selects', () => {
		it('has correct values on select')

		it('has correct error classes if date is invalid on submit')

		it('renders and shows error message if date is invalid on submit')

		it('has correct error classes if date is less than 13 years ago on submit')

		it('renders and shows error message if less than 13 years ago on submit')
	})

	describe('email field input', () => {
		it('has correct value on input', async () => {
			const { getByRole } = render(<SignupForm />)

			const emailInput = getByRole('textbox', { name: 'Email' })
			await userEvent.type(emailInput, 'test text')

			expect(emailInput).toHaveValue('test text')
		})

		it('has correct error classes if field is empty on submit', async () => {
			const { getByRole } = render(<SignupForm />)

			await userEvent.click(getByRole('button', { name: 'Submit' }))
			expect(getByRole('textbox', { name: 'Email' })).toHaveClass('border-red-500 text-red-500')
		})

		it('renders and shows error message if field is empty on submit', async () => {
			const { getByRole, getByText } = render(<SignupForm />)

			await userEvent.click(getByRole('button', { name: 'Submit' }))
			expect(getByText('Please enter an email address')).toBeVisible()
		})

		it('has correct error classes if input is invalid on submit', async () => {
			const { getByRole } = render(<SignupForm />)

			const emailInput = getByRole('textbox', { name: 'Email' })
			await userEvent.type(emailInput, 'invalid text')

			await userEvent.click(getByRole('button', { name: 'Submit' }))
			expect(emailInput).toHaveClass('border-red-500 text-red-500')
		})

		it('renders and shows error message if input is invalid on submit', async () => {
			const { getByRole, getByText } = render(<SignupForm />)

			await userEvent.type(getByRole('textbox', { name: 'Email' }), 'invalid text')

			await userEvent.click(getByRole('button', { name: 'Submit' }))
			expect(getByText('Invalid email address')).toBeVisible()
		})
	})

	describe('password field input', () => {
		it('has correct value on input', async () => {
			const { getByLabelText } = render(<SignupForm />)

			const passwordInput = getByLabelText('Password')
			await userEvent.type(passwordInput, 'test text')

			expect(passwordInput).toHaveValue('test text')
		})

		it('has correct error classes if field is empty on submit', async () => {
			const { getByRole, getByLabelText } = render(<SignupForm />)

			await userEvent.click(getByRole('button', { name: 'Submit' }))
			expect(getByLabelText('Password')).toHaveClass('border-red-500 text-red-500')
		})

		it('renders and shows error message if field is empty on submit', async () => {
			const { getByRole, getByText } = render(<SignupForm />)

			await userEvent.click(getByRole('button', { name: 'Submit' }))
			expect(getByText('Please enter a password')).toBeVisible()
		})

		it.skip('has correct error classes if input length is less than 8 on submit', async () => {
			const { getByRole, getByLabelText } = render(<SignupForm />)

			await userEvent.click(getByRole('button', { name: 'Submit' }))
			expect(getByLabelText('Password')).toHaveClass('border-red-500 text-red-500')
		})

		it.skip('renders and shows error message if input length is less than 8 on submit', async () => {
			const { getByRole, getByText } = render(<SignupForm />)

			await userEvent.click(getByRole('button', { name: 'Submit' }))
			expect(getByText('Please enter a password')).toBeVisible()
		})
	})

	//describe('submit button', () => {})

	describe('log in link', () => {
		it('links to correct address', () => {
			const { getByRole } = render(<SignupForm />)
			expect(getByRole('link', { name: 'Log in' })).toHaveAttribute('href', '/login')
		})
	})
})
