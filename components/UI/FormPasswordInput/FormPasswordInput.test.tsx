import { render } from '@testing-library/react'
import FormPasswordInput from './FormPasswordInput'

const mocks = vi.hoisted(() => ({
    errorMessage: 'Test error message',
}))

vi.mock('../Form', () => ({
    useFormField: vi.fn().mockReturnValue({ error: { message: mocks.errorMessage } }),
}))

describe('FormInput', () => {
    it('handles error correctly', () => {
        const { getByTestId, getByText } = render(
            <FormPasswordInput value={''} name={'Input'} onChange={() => {}} onBlur={() => {}} />,
        )

        expect(getByTestId('passwordInput')).toHaveClass('border-red-500 text-red-500')
        expect(getByText(mocks.errorMessage)).toBeVisible()
    })
})
