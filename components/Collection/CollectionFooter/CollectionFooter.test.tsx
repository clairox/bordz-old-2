import { render } from '@testing-library/react'
import CollectionFooter from './CollectionFooter'
import userEvent from '@testing-library/user-event'

const mocks = vi.hoisted(() => {
	return {
		replace: vi.fn(),
		useRouterMock: vi.fn(),
		usePathnameMock: vi.fn(),
		useSearchParamsMock: vi.fn(),
	}
})

vi.mock('next/navigation', () => ({
	useRouter: mocks.useRouterMock.mockReturnValue({ replace: mocks.replace }),
	usePathname: mocks.usePathnameMock.mockReturnValue('/test-collection'),
	useSearchParams: mocks.useSearchParamsMock.mockReturnValue(new URLSearchParams()),
}))

describe('CollectionFooter', () => {
	it('renders and shows renderedProductCount and totalProductCount correctly', () => {
		const renderedProductCount = 10
		const { getByText, unmount } = render(
			<CollectionFooter
				renderedProductCount={renderedProductCount}
				totalProductCount={50}
				hasNextPage={true}
			/>
		)

		expect(getByText('Showing 10 of 50 products')).toBeVisible()
		unmount()
	})

	describe('load more button', () => {
		it('renders and is visible when hasNextPage is true', () => {
			const hasNextPage = true
			const { getByRole, unmount } = render(
				<CollectionFooter
					renderedProductCount={10}
					totalProductCount={50}
					hasNextPage={hasNextPage}
				/>
			)

			expect(getByRole('button', { name: 'Load More' })).toBeVisible()
			unmount()
		})
		it('does not render when hasNextPage is false', () => {
			const hasNextPage = false
			const { queryByRole, unmount } = render(
				<CollectionFooter
					renderedProductCount={50}
					totalProductCount={50}
					hasNextPage={hasNextPage}
				/>
			)

			expect(queryByRole('button', { name: 'Load More' })).not.toBeInTheDocument()
			unmount()
		})
		it('calls useRouter().replace with correct query on click', async () => {
			const { getByRole, unmount } = render(
				<CollectionFooter renderedProductCount={10} totalProductCount={50} hasNextPage={true} />
			)

			const loadMoreButton = getByRole('button', { name: 'Load More' })
			await userEvent.click(loadMoreButton)

			expect(mocks.replace).toHaveBeenCalledWith('/test-collection?start=40', {
				scroll: false,
			})
			unmount()
		})
	})
})
