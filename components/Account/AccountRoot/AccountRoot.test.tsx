import { render } from '@testing-library/react'
import AccountRoot from './AccountRoot'

vi.mock('next/navigation', () => ({
	useRouter: vi.fn().mockReturnValue({ replace: vi.fn() }),
}))

const customer = {
	acceptsMarketing: false,
	addresses: { nodes: [] },
	createdAt: Date.now(),
	displayName: 'Tess Name',
	email: 'tess@ema.il',
	firstName: 'Tess',
	id: 'test id',
	lastName: 'Name',
	numberOfOrders: 0,
	orders: { nodes: [], totalCount: 0 },
	tags: [],
	updatedAt: Date.now(),
}

describe('AccountRoot', () => {
	it('renders sidebar correctly', () => {
		const { getByRole } = render(<AccountRoot section={'settings'} customer={customer} />)
		expect(getByRole('heading', { level: 1, name: 'Hey, Tess!' })).toBeInTheDocument()
	})
})
