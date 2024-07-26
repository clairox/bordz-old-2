import { render } from '@testing-library/react'
import ChangePassword from './ChangePassword'

vi.mock('next/navigation', () => ({
	useRouter: vi.fn().mockReturnValue({ replace: vi.fn(), push: vi.fn() }),
	usePathname: vi.fn().mockReturnValue('/account/change-password'),
}))

describe('ChangePassword', () => {
	it('renders content correctly', () => {
		const { getByRole, getByLabelText } = render(<ChangePassword />)

		expect(getByRole('heading', { name: 'Change Password' })).toBeVisible()
		expect(getByLabelText('Password')).toBeVisible()
		expect(getByLabelText('Confirm Password')).toBeVisible()
		expect(getByRole('button', { name: 'Submit' })).toBeVisible()
	})
})
