import { render } from '@testing-library/react'
import CollectionSidebarHeader from './CollectionSidebarHeader'
import userEvent from '@testing-library/user-event'

const clearRefinements = vi.fn()
const toggleRefinement = vi.fn()
const deletePriceRefinement = vi.fn()

const selectedRefinements = [
	{
		label: 'Brand',
		values: ['Brand 1', 'Brand 2'],
	},
	{
		label: 'Size',
		values: ['Size 1'],
	},
]

describe('CollectionSidebarHeader', () => {
	it('does not render reset button when no refinements are selected', () => {
		const { queryByRole, unmount } = render(
			<CollectionSidebarHeader
				selectedRefinements={[]}
				clearRefinements={clearRefinements}
				toggleRefinement={toggleRefinement}
				deletePriceRefinement={deletePriceRefinement}
			/>
		)

		expect(queryByRole('button', { name: 'Reset' })).not.toBeInTheDocument()
		unmount()
	})

	it('renders and shows reset button when refinements are selected', () => {
		const { queryByRole, unmount } = render(
			<CollectionSidebarHeader
				selectedRefinements={selectedRefinements}
				clearRefinements={clearRefinements}
				toggleRefinement={toggleRefinement}
				deletePriceRefinement={deletePriceRefinement}
			/>
		)

		expect(queryByRole('button', { name: 'Reset' })).toBeVisible()
		unmount()
	})

	it('does not render selected refinements when no refinements are selected', () => {
		const { queryByRole, unmount } = render(
			<CollectionSidebarHeader
				selectedRefinements={[]}
				clearRefinements={clearRefinements}
				toggleRefinement={toggleRefinement}
				deletePriceRefinement={deletePriceRefinement}
			/>
		)
		expect(queryByRole('listitem')).not.toBeInTheDocument()
		unmount()
	})

	it('renders and shows selected refinements correctly', () => {
		const { queryAllByRole, unmount } = render(
			<CollectionSidebarHeader
				selectedRefinements={selectedRefinements}
				clearRefinements={clearRefinements}
				toggleRefinement={toggleRefinement}
				deletePriceRefinement={deletePriceRefinement}
			/>
		)
		expect(queryAllByRole('listitem')[0]).toHaveTextContent('Brand 1')
		expect(queryAllByRole('listitem')[1]).toHaveTextContent('Brand 2')
		expect(queryAllByRole('listitem')[2]).toHaveTextContent('Size 1')
		unmount()
	})

	describe('selected refinement', () => {
		it('calls toggleRefinement with correct values on click', async () => {
			const { queryAllByRole, unmount } = render(
				<CollectionSidebarHeader
					selectedRefinements={selectedRefinements}
					clearRefinements={clearRefinements}
					toggleRefinement={toggleRefinement}
					deletePriceRefinement={deletePriceRefinement}
				/>
			)

			const expectedLabel = selectedRefinements[0].label
			const expectedValue = selectedRefinements[0].values[0]

			await userEvent.click(queryAllByRole('listitem')[0])
			expect(toggleRefinement).toHaveBeenCalledWith(expectedLabel, expectedValue)
			unmount()
		})
	})
})
