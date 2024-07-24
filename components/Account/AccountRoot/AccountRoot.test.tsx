import { render } from '@testing-library/react'
import AccountRoot from './AccountRoot'

vi.mock('@/context/AuthContext/AuthContext', () => ({
	useAuth: vi.fn().mockReturnValue({ user: { firstName: 'Name' } }),
}))

describe('AccountRoot', () => {
	it('renders sidebar correctly', () => {
		const { getByRole } = render(<AccountRoot />)
		expect(getByRole('heading', { level: 1, name: 'Hey, Name!' })).toBeInTheDocument()
	})
})
