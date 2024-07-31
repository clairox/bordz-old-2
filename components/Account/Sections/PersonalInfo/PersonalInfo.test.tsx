import { render } from '@testing-library/react'
import PersonalInfo from './PersonalInfo'

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

describe('PersonalInfo', () => {
	it('renders content correctly', () => {
		const { getByRole } = render(<PersonalInfo />)

		expect(getByRole('heading', { name: 'Personal Info' })).toBeVisible()
		expect(getByRole('textbox', { name: 'Email' })).toBeVisible()
		expect(getByRole('textbox', { name: 'First Name' })).toBeVisible()
		expect(getByRole('textbox', { name: 'Last Name' })).toBeVisible()
		expect(getByRole('button', { name: 'Submit' })).toBeVisible()
	})
})
