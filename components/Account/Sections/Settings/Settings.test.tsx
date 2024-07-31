import { render } from '@testing-library/react'
import Settings from './Settings'
import userEvent from '@testing-library/user-event'

const mocks = vi.hoisted(() => {
	return {
		push: vi.fn(),
	}
})

vi.mock('next/navigation', () => ({
	useRouter: vi.fn().mockReturnValue({ push: mocks.push }),
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

describe('Settings', () => {
	it('renders content correctly', () => {
		const { getByRole, getAllByRole, getByText } = render(<Settings />)

		expect(getByRole('heading', { level: 1, name: 'Settings' })).toBeVisible()

		expect(getByRole('heading', { level: 2, name: 'Personal Details' })).toBeVisible()
		expect(getAllByRole('link', { name: 'Edit' })[0]).toBeVisible()
		expect(getByText('Email')).toBeVisible()
		expect(getByText('test@ema.il')).toBeVisible()
		expect(getByText('First name')).toBeVisible()
		expect(getByText('Tess')).toBeVisible()
		expect(getByText('Last name')).toBeVisible()
		expect(getByText('Name')).toBeVisible()

		expect(getByRole('heading', { level: 2, name: 'Address' })).toBeVisible()
		expect(getAllByRole('link', { name: 'Edit' })[1]).toBeVisible()
		expect(getByText('No home address saved.')).toBeVisible()

		expect(getByRole('heading', { level: 2, name: 'Delete Account' })).toBeVisible()
		expect(getByRole('button', { name: 'Delete Account' })).toBeVisible()
	})

	describe('edit links', () => {
		it('links to correct location', () => {
			const { getAllByRole } = render(<Settings />)

			expect(getAllByRole('link', { name: 'Edit' })[0]).toHaveAttribute(
				'href',
				'/account/personal-info'
			)
			expect(getAllByRole('link', { name: 'Edit' })[1]).toHaveAttribute(
				'href',
				'/account/addresses'
			)
		})
	})

	describe('delete account button', () => {
		it('calls router.push with correct value on click', async () => {
			const { getByRole } = render(<Settings />)

			await userEvent.click(getByRole('button', { name: 'Delete Account' }))
			expect(mocks.push).toHaveBeenCalledWith('/account/delete-account')
		})
	})
})
