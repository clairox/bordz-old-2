import { render } from '@testing-library/react'
import DeleteAccount from './DeleteAccount'

vi.mock('next/navigation', () => ({
	useRouter: vi.fn().mockReturnValue({ replace: vi.fn(), push: vi.fn() }),
	usePathname: vi.fn().mockReturnValue('/account/change-password'),
}))

vi.mock('@/context/AccountContext/AccountContext', () => ({
	useAccountContext: vi.fn().mockReturnValue({
		customer: {
			email: 'test@ema.il',
			firstName: 'Tess',
			lastName: 'Name',
			defaultAddress: undefined,
		},
	}),
}))

describe('DeleteAccount', () => {
	it('renders content correctly', () => {
		const { getByRole, getByLabelText } = render(<DeleteAccount />)

		expect(getByRole('heading', { name: 'Delete Account' })).toBeVisible()
		expect(getByLabelText('Confirm Password')).toBeVisible()
		expect(getByRole('button', { name: 'Delete Account' })).toBeVisible()
		expect(getByRole('button', { name: 'Delete Account' })).toHaveClass('bg-destructive')
	})
})
