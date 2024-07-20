import { ProductFilterMap } from '@/types'
import { render } from '@testing-library/react'
import CollectionSidebar from './CollectionSidebar'
import userEvent from '@testing-library/user-event'
import { ReadonlyURLSearchParams } from 'next/navigation'

const ResizeObserverMock = vi.fn(() => ({
	observe: vi.fn(),
	unobserve: vi.fn(),
	disconnect: vi.fn(),
}))

vi.stubGlobal('ResizeObserver', ResizeObserverMock)

const availableFilters: ProductFilterMap = new Map([
	['brand', ['Brand 1', 'Brand 2', 'Brand 3']],
	['size', ['Size 1', 'Size 2', 'Size 3']],
	['color', ['Color 1', 'Color 2']],
])
const maxPrice = 83.95
const openRefinements = ['Sort', 'Brand', 'Size', 'Color', 'Price']
const setOpenRefinements = vi.fn()
const basePath = '/test-collection'
const router = {
	replace: vi.fn(),
	back: vi.fn(),
	forward: vi.fn(),
	refresh: vi.fn(),
	push: vi.fn(),
	prefetch: vi.fn(),
}
const searchParams = new URLSearchParams() as ReadonlyURLSearchParams

describe('CollectionSidebar', () => {
	it('renders and shows header content', async () => {
		const { getByText, unmount } = render(
			<CollectionSidebar
				availableFilters={availableFilters}
				maxPrice={maxPrice}
				openRefinements={openRefinements}
				setOpenRefinements={setOpenRefinements}
				basePath={basePath}
				router={router}
				searchParams={searchParams}
			/>
		)

		expect(getByText('Refine By:')).toBeVisible()
		unmount()
	})

	it('renders and shows CollectionSidebarMenu', () => {
		const { getByText, unmount } = render(
			<CollectionSidebar
				availableFilters={availableFilters}
				maxPrice={maxPrice}
				openRefinements={openRefinements}
				setOpenRefinements={setOpenRefinements}
				basePath={basePath}
				router={router}
				searchParams={searchParams}
			/>
		)

		expect(getByText('Sort')).toBeVisible()
		expect(getByText('Brand')).toBeVisible()
		expect(getByText('Size')).toBeVisible()
		expect(getByText('Color')).toBeVisible()
		expect(getByText('Price')).toBeVisible()
		unmount()
	})

	it('renders and shows CollectionSidebarMenuItem children', () => {
		const { getByRole, getByText, unmount } = render(
			<CollectionSidebar
				availableFilters={availableFilters}
				maxPrice={maxPrice}
				openRefinements={openRefinements}
				setOpenRefinements={setOpenRefinements}
				basePath={basePath}
				router={router}
				searchParams={searchParams}
			/>
		)

		expect(getByText('Recommended')).toBeVisible()
		expect(getByRole('checkbox', { name: 'Brand 1' })).toBeVisible()
		expect(getByRole('checkbox', { name: 'Size 1' })).toBeVisible()
		expect(getByRole('checkbox', { name: 'Size 3' })).toBeVisible()
		expect(getByRole('checkbox', { name: 'Color 1' })).toBeVisible()
		expect(getByRole('checkbox', { name: 'Color 2' })).toBeVisible()
		expect(getByText('$0')).toBeVisible()
		expect(getByText('$85')).toBeVisible()
		unmount()
	})

	it('does not render CollectionSidebarMenuItem children when closed', () => {
		const { queryByRole, unmount } = render(
			<CollectionSidebar
				availableFilters={availableFilters}
				maxPrice={maxPrice}
				openRefinements={['Sort', 'Size', 'Color', 'Price']}
				setOpenRefinements={setOpenRefinements}
				basePath={basePath}
				router={router}
				searchParams={searchParams}
			/>
		)

		expect(queryByRole('checkbox', { name: 'Brand 1' })).not.toBeInTheDocument()
		expect(queryByRole('checkbox', { name: 'Brand 2' })).not.toBeInTheDocument()
		expect(queryByRole('checkbox', { name: 'Brand 3' })).not.toBeInTheDocument()
		unmount()
	})

	describe('sort radio group', () => {
		it("has value 'Recommended' when url params does not contain related search query", () => {
			const { getByRole, getByText, unmount } = render(
				<CollectionSidebar
					availableFilters={availableFilters}
					maxPrice={maxPrice}
					openRefinements={['Sort']}
					setOpenRefinements={setOpenRefinements}
					basePath={basePath}
					router={router}
					searchParams={searchParams}
				/>
			)

			expect(getByRole('radio', { name: 'Recommended' })).toHaveAttribute('checked')
			expect(getByText('Recommended')).toHaveClass('font-semibold')
			unmount()
		})

		it('has correct value when url params contains related search query', () => {
			const testSearchParams = new URLSearchParams([
				['sortBy', 'priceLowToHigh'],
			]) as ReadonlyURLSearchParams

			const { getByRole, getByText, unmount } = render(
				<CollectionSidebar
					availableFilters={availableFilters}
					maxPrice={maxPrice}
					openRefinements={['Sort']}
					setOpenRefinements={setOpenRefinements}
					basePath={basePath}
					router={router}
					searchParams={testSearchParams}
				/>
			)

			expect(getByRole('radio', { name: 'Recommended' })).not.toHaveAttribute('checked')
			expect(getByText('Recommended')).not.toHaveClass('font-semibold')
			expect(getByRole('radio', { name: 'Price: Low to High' })).toHaveAttribute('checked')
			expect(getByText('Price: Low to High')).toHaveClass('font-semibold')
			unmount()
		})
	})

	describe('product checkbox filter', () => {
		it('is not checked when url params does not contain related search query', () => {
			const { getByRole, unmount } = render(
				<CollectionSidebar
					availableFilters={availableFilters}
					maxPrice={maxPrice}
					openRefinements={['Brand']}
					setOpenRefinements={setOpenRefinements}
					basePath={basePath}
					router={router}
					searchParams={searchParams}
				/>
			)

			expect(getByRole('checkbox', { name: 'Brand 1' })).not.toHaveAttribute('checked')
			unmount()
		})

		it('is checked when url params contains related search query', () => {
			const testSearchParams = new URLSearchParams([
				['brand', 'Brand 1'],
			]) as ReadonlyURLSearchParams

			const { getByRole, unmount } = render(
				<CollectionSidebar
					availableFilters={availableFilters}
					maxPrice={maxPrice}
					openRefinements={['Brand']}
					setOpenRefinements={setOpenRefinements}
					basePath={basePath}
					router={router}
					searchParams={testSearchParams}
				/>
			)

			expect(getByRole('checkbox', { name: 'Brand 1' })).toHaveAttribute('checked')
			unmount()
		})
	})

	describe('product price range filter', () => {
		it('has default values when url params does not contain related search query', () => {
			const { getByText, unmount } = render(
				<CollectionSidebar
					availableFilters={availableFilters}
					maxPrice={maxPrice}
					openRefinements={['Price']}
					setOpenRefinements={setOpenRefinements}
					basePath={basePath}
					router={router}
					searchParams={searchParams}
				/>
			)

			expect(getByText('$0')).toBeVisible()
			expect(getByText('$85')).toBeVisible()
			unmount()
		})

		it('has correct values when url params contains related search query', () => {
			const testSearchParams = new URLSearchParams([
				['priceMin', '20'],
				['priceMax', '75'],
			]) as ReadonlyURLSearchParams

			const { queryByText, getByText, unmount } = render(
				<CollectionSidebar
					availableFilters={availableFilters}
					maxPrice={maxPrice}
					openRefinements={['Price']}
					setOpenRefinements={setOpenRefinements}
					basePath={basePath}
					router={router}
					searchParams={testSearchParams}
				/>
			)

			expect(queryByText('$0')).not.toBeInTheDocument()
			expect(queryByText('$85')).not.toBeInTheDocument()
			expect(getByText('$20')).toBeVisible()
			expect(getByText('$75')).toBeVisible()
			unmount()
		})
	})

	describe('checked product filter', () => {
		it('calls useRouter().replace with correct values on click', async () => {
			const testSearchParams = new URLSearchParams([
				['brand', 'Brand 1'],
			]) as ReadonlyURLSearchParams

			const { getByRole, unmount } = render(
				<CollectionSidebar
					availableFilters={availableFilters}
					maxPrice={maxPrice}
					openRefinements={['Brand']}
					setOpenRefinements={setOpenRefinements}
					basePath={basePath}
					router={router}
					searchParams={testSearchParams}
				/>
			)

			await userEvent.click(getByRole('checkbox', { name: 'Brand 1' }))
			expect(router.replace).toHaveBeenCalledWith('/test-collection', { scroll: false })
			unmount()
		})

		it('calls useRouter().replace with correct values on click when url params contains search query', async () => {
			const testSearchParams = new URLSearchParams([
				['brand', 'Brand 1|Brand 2'],
				['color', 'Color 1'],
			]) as ReadonlyURLSearchParams

			const { getByRole, unmount } = render(
				<CollectionSidebar
					availableFilters={availableFilters}
					maxPrice={maxPrice}
					openRefinements={['Brand']}
					setOpenRefinements={setOpenRefinements}
					basePath={basePath}
					router={router}
					searchParams={testSearchParams}
				/>
			)

			await userEvent.click(getByRole('checkbox', { name: 'Brand 1' }))
			expect(router.replace).toHaveBeenCalledWith('/test-collection?brand=Brand+2&color=Color+1', {
				scroll: false,
			})
			unmount()
		})
	})

	describe('unchecked product filter', () => {
		it('calls useRouter().replace with correct values on click', async () => {
			const { getByRole, unmount } = render(
				<CollectionSidebar
					availableFilters={availableFilters}
					maxPrice={maxPrice}
					openRefinements={['Brand']}
					setOpenRefinements={setOpenRefinements}
					basePath={basePath}
					router={router}
					searchParams={searchParams}
				/>
			)

			await userEvent.click(getByRole('checkbox', { name: 'Brand 1' }))
			expect(router.replace).toHaveBeenCalledWith('/test-collection?brand=Brand+1', {
				scroll: false,
			})
			unmount()
		})

		it('calls useRouter().replace with correct values on click when url params contains search query', async () => {
			const testSearchParams = new URLSearchParams([
				['brand', 'Brand 2'],
				['color', 'Color 1'],
			]) as ReadonlyURLSearchParams

			const { getByRole, unmount } = render(
				<CollectionSidebar
					availableFilters={availableFilters}
					maxPrice={maxPrice}
					openRefinements={['Brand']}
					setOpenRefinements={setOpenRefinements}
					basePath={basePath}
					router={router}
					searchParams={testSearchParams}
				/>
			)

			await userEvent.click(getByRole('checkbox', { name: 'Brand 1' }))
			expect(router.replace).toHaveBeenCalledWith(
				'/test-collection?brand=Brand+2%7CBrand+1&color=Color+1',
				{
					scroll: false,
				}
			)
			unmount()
		})
	})
})
