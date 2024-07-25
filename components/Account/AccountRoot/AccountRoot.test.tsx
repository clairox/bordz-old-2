import { render } from '@testing-library/react'
import AccountRoot from './AccountRoot'

vi.mock('next/navigation', () => ({
	useRouter: vi.fn().mockReturnValue({ replace: vi.fn() }),
}))

describe('AccountRoot', () => {
	it('renders sidebar correctly', () => {
		const { getByRole } = render(
			<AccountRoot section={'settings'} customer={{ firstName: 'Name' }} />
		)
		expect(getByRole('heading', { level: 1, name: 'Hey, Name!' })).toBeInTheDocument()
	})
})
