import { render } from '@testing-library/react'
import Page from './page'

const mocks = vi.hoisted(() => {
	return {
		redirectMock: vi.fn(),
		isAuthenticatedMock: vi.fn(),
	}
})

vi.mock('next/navigation', () => ({
	redirect: mocks.redirectMock,
	useRouter: vi.fn(),
	useSearchParams: vi.fn().mockReturnValue(new URLSearchParams()),
}))

vi.mock('@/lib/utils/ssr', () => ({
	isAuthenticated: mocks.isAuthenticatedMock.mockReturnValue(false),
}))

describe('Login page', () => {
	it('calls redirect with correct value if isAuthenticated is true', () => {
		mocks.isAuthenticatedMock.mockReturnValue(true)
		render(<Page searchParams={{}} />)
		expect(mocks.redirectMock).toHaveBeenCalledWith('/')
	})
	it('renders sign up page when register search param is true', () => {
		const { getByRole } = render(<Page searchParams={{ register: 'true' }} />)
		expect(getByRole('heading', { name: 'Sign Up' })).toBeVisible()
	})

	it('renders login page when register search param is null', () => {
		const { getByRole } = render(<Page searchParams={{}} />)
		expect(getByRole('heading', { name: 'Login' })).toBeVisible()
	})
})
