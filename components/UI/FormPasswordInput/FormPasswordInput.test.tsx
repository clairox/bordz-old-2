import { render } from '@testing-library/react'
import PasswordInput from './FormPasswordInput'
import userEvent from '@testing-library/user-event'

describe('PasswordInput', () => {
    it("has a default type of 'password'", () => {
        const { getByTestId } = render(<PasswordInput />)
        expect(getByTestId('passwordInput')).toHaveAttribute('type', 'password')
    })

    it('renders and shows correct icon when password is set to hide', async () => {
        const { getByTestId } = render(<PasswordInput />)
        expect(getByTestId('eyeSlashIcon')).toBeVisible()
    })

    it('renders and shows correct icon when password is set to show', async () => {
        const { getByTestId } = render(<PasswordInput />)

        await userEvent.click(getByTestId('showHideButton'))
        expect(getByTestId('eyeIcon')).toBeVisible()
    })

    it("input type is 'password' if password is set to hide", () => {
        const { getByTestId } = render(<PasswordInput />)
        expect(getByTestId('passwordInput')).toHaveAttribute('type', 'password')
    })

    it("input type is 'text' password is set to show", async () => {
        const { getByTestId } = render(<PasswordInput />)

        const passwordInput = getByTestId('passwordInput')
        await userEvent.click(getByTestId('showHideButton'))

        expect(passwordInput).toHaveAttribute('type', 'text')
    })
})
