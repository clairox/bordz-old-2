import { render } from '@testing-library/react'
import CollectionView from './CollectionView'

const mocks = vi.hoisted(() => {
	return {
		replace: vi.fn(),
		useRouterMock: vi.fn(),
		useParamsMock: vi.fn(),
		usePathnameMock: vi.fn(),
		useSearchParamsMock: vi.fn(),
		useCollectionMaxPriceMock: vi.fn(),
		useCollectionMock: vi.fn(),
	}
})

vi.mock('next/navigation', () => ({
	useRouter: mocks.useRouterMock.mockReturnValue({ replace: mocks.replace }),
	useParams: mocks.useParamsMock.mockReturnValue({ collection: ['test-collection'] }),
	usePathname: mocks.usePathnameMock.mockReturnValue('/test-collection'),
	useSearchParams: mocks.useSearchParamsMock.mockReturnValue(new URLSearchParams()),
}))

vi.mock('@/hooks/useCollectionMaxPrice', () => ({
	useCollectionMaxPrice: mocks.useCollectionMaxPriceMock.mockReturnValue({
		maxPrice: 60,
		error: null,
	}),
}))

vi.mock('@/hooks/useCollection', () => ({
	useCollection: mocks.useCollectionMock.mockReturnValue({
		collection: { title: 'Test Collection' },
		products: [
			{
				title: 'Test Product',
				handle: 'test-product',
				price: 59.95,
				featuredImage: {
					src: '/testUrl.com/testSrc',
					width: 50,
					height: 50,
				},
			},
		],
		productCount: 1,
		availableFilters: [
			{
				label: 'brand',
				values: ['Brand 1', 'Brand 2', 'Brand 3'],
			},
			{
				label: 'size',
				values: ['Size 1', 'Size 2', 'Size 3'],
			},
			{
				label: 'color',
				values: ['Color 1', 'Color 2'],
			},
		],
		filteredPriceRange: [0, 60],
		subCollectionTitles: ['Subcollection 1', 'Subcollection 2'],
		hasNextPage: false,
		error: null,
	}),
}))

describe('CollectionView', () => {
	it('renders CollectionHeader with correct title', () => {
		const { getByRole, unmount } = render(<CollectionView />)

		expect(getByRole('heading', { level: 1, name: 'Test Collection' })).toBeInTheDocument()
		unmount()
	})

	it('renders CollectionSidebar', () => {
		const { getByText, unmount } = render(<CollectionView />)

		expect(getByText('Refine By:')).toBeInTheDocument()
		unmount()
	})

	it('renders CollectionProductList', () => {
		const { getByText, unmount } = render(<CollectionView />)

		expect(getByText('Test Product')).toBeInTheDocument()
		unmount()
	})

	it('renders CollectionFooter', () => {
		const { getByText, unmount } = render(<CollectionView />)

		expect(getByText('Showing 1 of 1 products')).toBeInTheDocument()
		unmount()
	})

	it('handles errors gracefully', () => {
		mocks.useCollectionMock.mockReturnValueOnce({
			collection: null,
			products: null,
			productCount: undefined,
			availableFilters: null,
			filteredPriceRange: undefined,
			subcollectionNames: null,
			hasNextPage: undefined,
			error: new Error('Test error'),
		})

		const { container } = render(<CollectionView />)

		expect(container).toBeEmptyDOMElement()
	})
})
