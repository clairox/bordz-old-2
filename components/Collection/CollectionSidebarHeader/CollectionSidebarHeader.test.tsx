import { render } from '@testing-library/react'
import CollectionSidebarHeader from './CollectionSidebarHeader'
import userEvent from '@testing-library/user-event'
import { FilterTag } from '@/types'

const clearFilters = vi.fn()
const unsetFilter = vi.fn()

const filterTags: FilterTag[] = [
    {
        label: 'Brand 1',
        key: 'brand',
        value: 'Brand 1',
    },
    {
        label: 'Brand 2',
        key: 'brand',
        value: 'Brand 2',
    },
    {
        label: 'Size 1',
        key: 'size',
        value: 'Size 1',
    },
]

describe('CollectionSidebarHeader', () => {
    it('does not render reset button when no refinements are selected', () => {
        const { queryByRole, unmount } = render(
            <CollectionSidebarHeader
                filterTags={[]}
                clearFilters={clearFilters}
                unsetFilter={unsetFilter}
            />,
        )

        expect(queryByRole('button', { name: 'Reset' })).not.toBeInTheDocument()
        unmount()
    })

    it('renders and shows reset button when refinements are selected', () => {
        const { queryByRole, unmount } = render(
            <CollectionSidebarHeader
                filterTags={filterTags}
                clearFilters={clearFilters}
                unsetFilter={unsetFilter}
            />,
        )

        expect(queryByRole('button', { name: 'Reset' })).toBeVisible()
        unmount()
    })

    it('does not render selected refinements when no refinements are selected', () => {
        const { queryByRole, unmount } = render(
            <CollectionSidebarHeader
                filterTags={[]}
                clearFilters={clearFilters}
                unsetFilter={unsetFilter}
            />,
        )
        expect(queryByRole('listitem')).not.toBeInTheDocument()
        unmount()
    })

    it('renders and shows selected refinements correctly', () => {
        const { queryAllByRole, unmount } = render(
            <CollectionSidebarHeader
                filterTags={filterTags}
                clearFilters={clearFilters}
                unsetFilter={unsetFilter}
            />,
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
                    filterTags={filterTags}
                    clearFilters={clearFilters}
                    unsetFilter={unsetFilter}
                />,
            )

            await userEvent.click(queryAllByRole('listitem')[0])
            expect(unsetFilter).toHaveBeenCalledWith('brand', 'Brand 1')
            unmount()
        })
    })
})
