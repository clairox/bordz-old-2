import { render } from '@testing-library/react'
import CollectionSidebarHeader from './CollectionSidebarHeader'
import userEvent from '@testing-library/user-event'
import { ProductFilterMap } from '@/types'

const clearFilters = vi.fn()
const deselectNonPriceFilter = vi.fn()
const removePriceFilter = vi.fn()

const selectedFilters: ProductFilterMap = new Map([
	['brand', ['Brand 1', 'Brand 2']],
	['size', ['Size 1']],
])

describe('CollectionSidebarHeader', () => {
	it('does not render reset button when no refinements are selected', () => {
		const { queryByRole, unmount } = render(
			<CollectionSidebarHeader
				selectedFilters={new Map()}
				priceFilter={[]}
				clearFilters={clearFilters}
				deselectNonPriceFilter={deselectNonPriceFilter}
				removePriceFilter={removePriceFilter}
			/>
		)

		expect(queryByRole('button', { name: 'Reset' })).not.toBeInTheDocument()
		unmount()
	})

	it('renders and shows reset button when refinements are selected', () => {
		const { queryByRole, unmount } = render(
			<CollectionSidebarHeader
				selectedFilters={selectedFilters}
				priceFilter={[]}
				clearFilters={clearFilters}
				deselectNonPriceFilter={deselectNonPriceFilter}
				removePriceFilter={removePriceFilter}
			/>
		)

		expect(queryByRole('button', { name: 'Reset' })).toBeVisible()
		unmount()
	})

	it('does not render selected refinements when no refinements are selected', () => {
		const { queryByRole, unmount } = render(
			<CollectionSidebarHeader
				selectedFilters={new Map()}
				priceFilter={[]}
				clearFilters={clearFilters}
				deselectNonPriceFilter={deselectNonPriceFilter}
				removePriceFilter={removePriceFilter}
			/>
		)
		expect(queryByRole('listitem')).not.toBeInTheDocument()
		unmount()
	})

	it('renders and shows selected refinements correctly', () => {
		const { queryAllByRole, unmount } = render(
			<CollectionSidebarHeader
				selectedFilters={selectedFilters}
				priceFilter={[]}
				clearFilters={clearFilters}
				deselectNonPriceFilter={deselectNonPriceFilter}
				removePriceFilter={removePriceFilter}
			/>
		)
		expect(queryAllByRole('listitem')[0]).toHaveTextContent('Brand 1')
		expect(queryAllByRole('listitem')[1]).toHaveTextContent('Brand 2')
		expect(queryAllByRole('listitem')[2]).toHaveTextContent('Size 1')
		unmount()
	})

	describe('selected refinement', () => {
		it('calls deselectNonPriceFilter with correct values on click', async () => {
			const { queryAllByRole, unmount } = render(
				<CollectionSidebarHeader
					selectedFilters={selectedFilters}
					priceFilter={[]}
					clearFilters={clearFilters}
					deselectNonPriceFilter={deselectNonPriceFilter}
					removePriceFilter={removePriceFilter}
				/>
			)

			await userEvent.click(queryAllByRole('listitem')[0])
			expect(deselectNonPriceFilter).toHaveBeenCalledWith('brand', selectedFilters.get('brand')![0])
			unmount()
		})
	})
})
