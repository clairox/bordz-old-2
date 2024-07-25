import { render } from '@testing-library/react'
import PersonalInfoForm from './PersonalInfoForm'
import userEvent from '@testing-library/user-event'

const mocks = vi.hoisted(() => {
	return {
		signup: vi.fn(),
	}
})

vi.mock('@/context/AuthContext/AuthContext', () => ({
	useAuth: vi.fn().mockReturnValue({ signup: mocks.signup }),
}))

const firstName = 'Tess'
const lastName = 'Subject'
const email = 'tess@test.com'

describe('PersonalInfoForm', () => {
	it('renders and shows header', () => {
		const { getByRole } = render(
			<PersonalInfoForm firstName={firstName} lastName={lastName} email={email} />
		)
		expect(getByRole('heading', { level: 1, name: 'Personal Info' })).toBeVisible()
	})

	it('renders and shows all fields', () => {
		const { getByRole } = render(
			<PersonalInfoForm firstName={firstName} lastName={lastName} email={email} />
		)

		expect(getByRole('textbox', { name: 'Email' })).toBeVisible()
		expect(getByRole('textbox', { name: 'First Name' })).toBeVisible()
		expect(getByRole('textbox', { name: 'Last Name' })).toBeVisible()
	})

	it('renders and shows submit button', () => {
		const { getByRole } = render(
			<PersonalInfoForm firstName={firstName} lastName={lastName} email={email} />
		)
		expect(getByRole('button', { name: 'Submit' })).toBeVisible()
	})

	it.skip('renders and shows form error message if..............', async () => {
		mocks.signup.mockReturnValue({ error: { field: undefined, message: 'Error' } })
		const { getByRole, getByLabelText, getByTestId } = render(
			<PersonalInfoForm firstName={firstName} lastName={lastName} email={email} />
		)

		await userEvent.type(getByRole('textbox', { name: 'Email' }), 'incorrect@ema.il')
		await userEvent.type(getByLabelText('Password'), 'incorrectPassword')
		await userEvent.click(getByRole('button', { name: 'Submit' }))

		expect(getByTestId('formErrorBox')).toBeVisible()
	})

	describe('first name input', () => {
		it('has correct value on input', async () => {
			const { getByRole } = render(
				<PersonalInfoForm firstName={firstName} lastName={lastName} email={email} />
			)

			const firstNameInput = getByRole('textbox', { name: 'First Name' })
			await userEvent.clear(firstNameInput)
			await userEvent.type(firstNameInput, 'test text')

			expect(firstNameInput).toHaveValue('test text')
		})

		it('has correct error classes if field is empty on submit', async () => {
			const { getByRole } = render(
				<PersonalInfoForm firstName={firstName} lastName={lastName} email={email} />
			)

			const firstNameInput = getByRole('textbox', { name: 'First Name' })
			await userEvent.clear(firstNameInput)
			await userEvent.click(getByRole('button', { name: 'Submit' }))
			expect(firstNameInput).toHaveClass('border-red-500 text-red-500')
		})

		it('renders and shows error message if field is empty on submit', async () => {
			const { getByRole, getByText } = render(
				<PersonalInfoForm firstName={firstName} lastName={lastName} email={email} />
			)

			const firstNameInput = getByRole('textbox', { name: 'First Name' })
			await userEvent.clear(firstNameInput)
			await userEvent.click(getByRole('button', { name: 'Submit' }))
			expect(getByText('Please enter your first name')).toBeVisible()
		})

		it('has correct error classes if input length is greater than 50 on submit', async () => {
			const { getByRole, getByText } = render(
				<PersonalInfoForm firstName={firstName} lastName={lastName} email={email} />
			)

			const text = 'test string that is longer than the accepted length of 50'
			const firstNameInput = getByRole('textbox', { name: 'First Name' })
			await userEvent.clear(firstNameInput)
			await userEvent.type(firstNameInput, text)
			await userEvent.click(getByRole('button', { name: 'Submit' }))

			expect(firstNameInput).toHaveClass('border-red-500 text-red-500')
		})

		it('renders and shows error message if input length is greater than 50 on submit', async () => {
			const { getByRole, getByText } = render(
				<PersonalInfoForm firstName={firstName} lastName={lastName} email={email} />
			)

			const text = 'test string that is longer than the accepted length of 50'
			const firstNameInput = getByRole('textbox', { name: 'First Name' })
			await userEvent.clear(firstNameInput)
			await userEvent.type(firstNameInput, text)
			await userEvent.click(getByRole('button', { name: 'Submit' }))

			expect(getByText('First name must not exceed 50 characters')).toBeVisible
		})
	})

	describe('last name input', () => {
		it('has correct value on input', async () => {
			const { getByRole } = render(
				<PersonalInfoForm firstName={firstName} lastName={lastName} email={email} />
			)

			const lastNameInput = getByRole('textbox', { name: 'Last Name' })
			await userEvent.clear(lastNameInput)
			await userEvent.type(lastNameInput, 'test text')
			expect(lastNameInput).toHaveValue('test text')
		})

		it('has correct error classes if field is empty on submit', async () => {
			const { getByRole } = render(
				<PersonalInfoForm firstName={firstName} lastName={lastName} email={email} />
			)

			const lastNameInput = getByRole('textbox', { name: 'Last Name' })
			await userEvent.clear(lastNameInput)
			await userEvent.click(getByRole('button', { name: 'Submit' }))
			expect(getByRole('textbox', { name: 'Last Name' })).toHaveClass('border-red-500 text-red-500')
		})

		it('renders and shows error message if field is empty on submit', async () => {
			const { getByRole, getByText } = render(
				<PersonalInfoForm firstName={firstName} lastName={lastName} email={email} />
			)

			const lastNameInput = getByRole('textbox', { name: 'Last Name' })
			await userEvent.clear(lastNameInput)
			await userEvent.click(getByRole('button', { name: 'Submit' }))
			expect(getByText('Please enter your last name')).toBeVisible()
		})

		it('has correct error classes if input length is greater than 50 on submit', async () => {
			const { getByRole, getByText } = render(
				<PersonalInfoForm firstName={firstName} lastName={lastName} email={email} />
			)

			const text = 'test string that is longer than the accepted length of 50'
			const lastNameInput = getByRole('textbox', { name: 'Last Name' })
			await userEvent.type(lastNameInput, text)
			await userEvent.click(getByRole('button', { name: 'Submit' }))

			expect(lastNameInput).toHaveClass('border-red-500 text-red-500')
		})

		it('renders and shows error message if input length is greater than 50 on submit', async () => {
			const { getByRole, getByText } = render(
				<PersonalInfoForm firstName={firstName} lastName={lastName} email={email} />
			)

			const text = 'test string that is longer than the accepted length of 50'
			await userEvent.type(getByRole('textbox', { name: 'Last Name' }), text)
			await userEvent.click(getByRole('button', { name: 'Submit' }))

			expect(getByText('Last name must not exceed 50 characters')).toBeVisible
		})
	})

	describe('email field input', () => {
		it('has correct value on input', async () => {
			const { getByRole } = render(
				<PersonalInfoForm firstName={firstName} lastName={lastName} email={email} />
			)

			const emailInput = getByRole('textbox', { name: 'Email' })
			await userEvent.clear(emailInput)
			await userEvent.type(emailInput, 'test text')

			expect(emailInput).toHaveValue('test text')
		})

		it('has correct error classes if field is empty on submit', async () => {
			const { getByRole } = render(
				<PersonalInfoForm firstName={firstName} lastName={lastName} email={email} />
			)

			const emailInput = getByRole('textbox', { name: 'Email' })
			await userEvent.clear(emailInput)
			await userEvent.click(getByRole('button', { name: 'Submit' }))
			expect(emailInput).toHaveClass('border-red-500 text-red-500')
		})

		it('renders and shows error message if field is empty on submit', async () => {
			const { getByRole, getByText } = render(
				<PersonalInfoForm firstName={firstName} lastName={lastName} email={email} />
			)

			const emailInput = getByRole('textbox', { name: 'Email' })
			await userEvent.clear(emailInput)
			await userEvent.click(getByRole('button', { name: 'Submit' }))
			expect(getByText('Please enter an email address')).toBeVisible()
		})

		it('has correct error classes if input is invalid on submit', async () => {
			const { getByRole } = render(
				<PersonalInfoForm firstName={firstName} lastName={lastName} email={email} />
			)

			const emailInput = getByRole('textbox', { name: 'Email' })
			await userEvent.clear(emailInput)
			await userEvent.type(emailInput, 'invalid text')

			await userEvent.click(getByRole('button', { name: 'Submit' }))
			expect(emailInput).toHaveClass('border-red-500 text-red-500')
		})

		it('renders and shows error message if input is invalid on submit', async () => {
			const { getByRole, getByText } = render(
				<PersonalInfoForm firstName={firstName} lastName={lastName} email={email} />
			)

			const emailInput = getByRole('textbox', { name: 'Email' })
			await userEvent.clear(emailInput)
			await userEvent.type(emailInput, 'invalid text')

			await userEvent.click(getByRole('button', { name: 'Submit' }))
			expect(getByText('Invalid email address')).toBeVisible()
		})
	})

	//describe('submit button', () => {})
})
