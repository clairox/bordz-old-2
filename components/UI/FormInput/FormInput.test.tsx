import { render } from '@testing-library/react'
import FormInput from './FormInput'

const mocks = vi.hoisted(() => ({
    errorMessage: 'Test error message',
}))

vi.mock('../Form', () => ({
    useFormField: vi.fn().mockReturnValue({ error: { message: mocks.errorMessage } }),
}))

describe('FormInput', () => {
    it('handles error correctly', () => {
        const { getByRole, getByText } = render(
            <FormInput value={''} name={'Input'} onChange={() => {}} onBlur={() => {}} />,
        )

        expect(getByRole('textbox')).toHaveClass('border-red-500 text-red-500')
        expect(getByText(mocks.errorMessage)).toBeVisible()
    })
})
