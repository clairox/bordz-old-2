import { render } from '@testing-library/react'
import LoginForm from './LoginForm'
import userEvent from '@testing-library/user-event'

describe('LoginForm', () => {
	it('renders and shows email field input', () => {
		const { getByRole } = render(<LoginForm />)
		expect(getByRole('textbox', { name: 'Email' })).toBeVisible()
	})

	it('renders and shows password field input', () => {
		const { getByLabelText } = render(<LoginForm />)
		expect(getByLabelText('Password')).toBeVisible()
	})

	it('renders and shows forgot password link', () => {
		const { getByRole } = render(<LoginForm />)
		expect(getByRole('link', { name: 'Forgot password?' })).toBeVisible()
	})

	it('renders and shows submit button', () => {
		const { getByRole } = render(<LoginForm />)
		expect(getByRole('button', { name: 'Submit' })).toBeVisible()
	})

	it('renders and shows create account link', () => {
		const { getByRole } = render(<LoginForm />)
		expect(getByRole('link', { name: 'Create an account' })).toBeVisible()
	})

	describe('email field input', () => {
		it('has correct value on input', async () => {
			const { getByRole } = render(<LoginForm />)

			const emailInput = getByRole('textbox', { name: 'Email' })
			await userEvent.type(emailInput, 'test text')

			expect(emailInput).toHaveValue('test text')
		})

		it('has correct error classes if field is empty on submit', async () => {
			const { getByRole } = render(<LoginForm />)

			await userEvent.click(getByRole('button', { name: 'Submit' }))
			expect(getByRole('textbox', { name: 'Email' })).toHaveClass('border-red-500 text-red-500')
		})

		it('renders and shows error message if field is empty on submit', async () => {
			const { getByRole, getByText } = render(<LoginForm />)

			await userEvent.click(getByRole('button', { name: 'Submit' }))
			expect(getByText('Please enter an email address')).toBeVisible()
		})

		it('has correct error classes if input is invalid on submit', async () => {
			const { getByRole } = render(<LoginForm />)

			const emailInput = getByRole('textbox', { name: 'Email' })
			await userEvent.type(emailInput, 'invalid text')

			await userEvent.click(getByRole('button', { name: 'Submit' }))
			expect(emailInput).toHaveClass('border-red-500 text-red-500')
		})

		it('renders and shows error message if input is invalid on submit', async () => {
			const { getByRole, getByText } = render(<LoginForm />)

			await userEvent.type(getByRole('textbox', { name: 'Email' }), 'invalid text')

			await userEvent.click(getByRole('button', { name: 'Submit' }))
			expect(getByText('Invalid email address')).toBeVisible()
		})
	})

	describe('password field input', () => {
		it('has correct value on input', async () => {
			const { getByLabelText } = render(<LoginForm />)

			const passwordInput = getByLabelText('Password')
			await userEvent.type(passwordInput, 'test text')

			expect(passwordInput).toHaveValue('test text')
		})

		it('has correct error classes if field is empty on submit', async () => {
			const { getByRole, getByLabelText } = render(<LoginForm />)

			await userEvent.click(getByRole('button', { name: 'Submit' }))
			expect(getByLabelText('Password')).toHaveClass('border-red-500 text-red-500')
		})

		it('renders and shows error message if field is empty on submit', async () => {
			const { getByRole, getByText } = render(<LoginForm />)

			await userEvent.click(getByRole('button', { name: 'Submit' }))
			expect(getByText('Please enter a password')).toBeVisible()
		})
	})

	describe('forgot password link', () => {
		it('links to correct address', () => {
			const { getByRole } = render(<LoginForm />)
			expect(getByRole('link', { name: 'Forgot password?' })).toHaveAttribute('href', '#')
		})
	})

	//describe('submit button', () => {})

	describe('create account link', () => {
		it('links to correct address', () => {
			const { getByRole } = render(<LoginForm />)
			expect(getByRole('link', { name: 'Create an account' })).toHaveAttribute(
				'href',
				'/login?register=true'
			)
		})
	})
})
