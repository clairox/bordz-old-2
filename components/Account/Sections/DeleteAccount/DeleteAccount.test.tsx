import { render } from '@testing-library/react'
import DeleteAccount from './DeleteAccount'

vi.mock('next/navigation', () => ({
	useRouter: vi.fn().mockReturnValue({ replace: vi.fn(), push: vi.fn() }),
	usePathname: vi.fn().mockReturnValue('/account/change-password'),
}))

describe('DeleteAccount', () => {
	it('renders content correctly', () => {
		const { getByRole, getByLabelText } = render(<DeleteAccount customerEmail="test@ema.il" />)

		expect(getByRole('heading', { name: 'Delete Account' })).toBeVisible()
		expect(getByLabelText('Confirm Password')).toBeVisible()
		expect(getByRole('button', { name: 'Delete Account' })).toBeVisible()
		expect(getByRole('button', { name: 'Delete Account' })).toHaveClass('bg-destructive')
	})
})
