import { render } from '@testing-library/react'
import ChangePasswordForm from './ChangePasswordForm'
import userEvent from '@testing-library/user-event'
import { RestClientError, RestClientResponse } from '@/lib/services/clients/restClient'

const mocks = vi.hoisted(() => {
    return {
        push: vi.fn(),
        restClientMock: vi.fn(),
    }
})

vi.mock('next/navigation', () => ({
    useRouter: vi.fn().mockReturnValue({ push: mocks.push }),
    usePathname: vi.fn().mockReturnValue('/account/change-password'),
}))

vi.mock('@/lib/services/clients/restClient', () => ({
    restClient: mocks.restClientMock.mockImplementation(() => {}),
}))

describe('ChangePasswordForm', () => {
    it('renders and shows all fields', () => {
        const { getByLabelText } = render(<ChangePasswordForm />)

        expect(getByLabelText('Password')).toBeVisible()
        expect(getByLabelText('Confirm Password')).toBeVisible()
    })

    it('calls router.push with correct value when fetch returns with 401 status', async () => {
        mocks.restClientMock.mockImplementationOnce(() => {
            const response = new RestClientResponse(
                {
                    ok: false,
                    headers: {},
                    status: 401,
                    type: 'error',
                    url: 'url',
                    redirected: false,
                } as Response,
                {},
            )
            throw new RestClientError('error', response.status, response)
        })
        const { getByRole, getByLabelText } = render(<ChangePasswordForm />)

        await userEvent.type(getByLabelText('Password'), 'testpassword')
        await userEvent.type(getByLabelText('Confirm Password'), 'testpassword')
        await userEvent.click(getByRole('button', { name: 'Submit' }))

        expect(mocks.push).toHaveBeenCalledWith(
            '/login?redirect=%2Faccount%2Fchange-password&reason=session_expired',
        )
    })

    it('renders and shows formSuccessBox if password is updated successfully', async () => {
        mocks.restClientMock.mockImplementationOnce(() => {
            success: true
        })
        const { getByRole, getByLabelText, getByTestId } = render(<ChangePasswordForm />)

        await userEvent.type(getByLabelText('Password'), 'testpassword')
        await userEvent.type(getByLabelText('Confirm Password'), 'testpassword')
        await userEvent.click(getByRole('button', { name: 'Submit' }))

        expect(getByTestId('formSuccessBox')).toBeVisible()
    })

    describe('password field input', () => {
        it('has correct value on input', async () => {
            const { getByLabelText } = render(<ChangePasswordForm />)

            const passwordInput = getByLabelText('Password')
            await userEvent.type(passwordInput, 'test text')

            expect(passwordInput).toHaveValue('test text')
        })

        it('has correct error classes if field is empty on submit', async () => {
            const { getByRole, getByLabelText } = render(<ChangePasswordForm />)

            await userEvent.click(getByRole('button', { name: 'Submit' }))
            expect(getByLabelText('Password')).toHaveClass('border-red-500 text-red-500')
        })

        it('renders and shows error message if field is empty on submit', async () => {
            const { getByRole, getByText } = render(<ChangePasswordForm />)

            await userEvent.click(getByRole('button', { name: 'Submit' }))
            expect(getByText('Please enter a password')).toBeVisible()
        })

        it('has correct error classes if input length is less than 8 on submit', async () => {
            const { getByRole, getByLabelText } = render(<ChangePasswordForm />)

            const passwordInput = getByLabelText('Password')
            await userEvent.type(passwordInput, 'test')
            await userEvent.click(getByRole('button', { name: 'Submit' }))
            expect(passwordInput).toHaveClass('border-red-500 text-red-500')
        })

        it('renders and shows error message if input length is less than 8 on submit', async () => {
            const { getByRole, getByLabelText, getByText } = render(<ChangePasswordForm />)

            await userEvent.type(getByLabelText('Password'), 'test')
            await userEvent.click(getByRole('button', { name: 'Submit' }))
            expect(getByText('Password must be at least 8 characters long')).toBeVisible()
        })
    })

    describe('confirm password field input', () => {
        it('has correct value on input', async () => {
            const { getByLabelText } = render(<ChangePasswordForm />)

            const confirmPasswordInput = getByLabelText('Confirm Password')
            await userEvent.type(confirmPasswordInput, 'test text')

            expect(confirmPasswordInput).toHaveValue('test text')
        })

        it('has correct error classes if field is empty on submit', async () => {
            const { getByRole, getByLabelText } = render(<ChangePasswordForm />)

            await userEvent.click(getByRole('button', { name: 'Submit' }))
            expect(getByLabelText('Confirm Password')).toHaveClass('border-red-500 text-red-500')
        })

        it('renders and shows error message if field is empty on submit', async () => {
            const { getByRole, getByText } = render(<ChangePasswordForm />)

            await userEvent.click(getByRole('button', { name: 'Submit' }))
            expect(getByText('Please enter password confirmation')).toBeVisible()
        })

        it('has correct error classes if input is not equal to password input on submit', async () => {
            const { getByRole, getByLabelText } = render(<ChangePasswordForm />)

            await userEvent.type(getByLabelText('Password'), 'test text')
            await userEvent.type(getByLabelText('Confirm Password'), 'test')

            await userEvent.click(getByRole('button', { name: 'Submit' }))
            expect(getByLabelText('Confirm Password')).toHaveClass('border-red-500 text-red-500')
        })

        it('renders and shows error message if input is not equal to password input on submit', async () => {
            const { getByRole, getByLabelText, getByText } = render(<ChangePasswordForm />)

            await userEvent.type(getByLabelText('Password'), 'test text')
            await userEvent.type(getByLabelText('Confirm Password'), 'test')

            await userEvent.click(getByRole('button', { name: 'Submit' }))
            expect(getByText('Passwords do not match')).toBeVisible()
        })

        it('renders and shows form success message if password changed successfully', async () => {
            global.fetch = vi.fn().mockReturnValue({ ok: true })
            const { getByRole, getByLabelText, getByTestId } = render(<ChangePasswordForm />)

            await userEvent.type(getByLabelText('Password'), 'newPassword')
            await userEvent.type(getByLabelText('Confirm Password'), 'newPassword')
            await userEvent.click(getByRole('button', { name: 'Submit' }))

            expect(getByTestId('formSuccessBox')).toBeVisible()
        })
    })
})
