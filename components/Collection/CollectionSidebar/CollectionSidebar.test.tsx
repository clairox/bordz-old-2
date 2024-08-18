import { render } from '@testing-library/react'
import CollectionSidebar from './CollectionSidebar'
import userEvent from '@testing-library/user-event'
import { ReadonlyURLSearchParams } from 'next/navigation'

const navigationMocks = vi.hoisted(() => ({
    useRouter: vi.fn(),
    usePathname: vi.fn(),
    useParams: vi.fn(),
    useSearchParams: vi.fn(),
    replace: vi.fn(),
    push: vi.fn(),
}))

const upfMocks = vi.hoisted(() => ({
    filters: new Map([
        ['brand', ['Brand 1', 'Brand 2']],
        ['size', ['Size 1', 'Size 2', 'Size 3']],
        ['color', ['Color 1', 'Color 2']],
        ['price', ['0', '85']],
    ]),
    selectedFilters: new Map(),
    selectToggleableFilter: vi.fn(),
    deselectToggleableFilter: vi.fn(),
    updatePriceFilter: vi.fn(),
    removePriceFilter: vi.fn(),
    clearAllFilters: vi.fn(),
    loading: false,
}))

vi.mock('next/navigation', () => ({
    useRouter: navigationMocks.useRouter.mockReturnValue({
        replace: navigationMocks.replace,
        push: navigationMocks.push,
    }),
    usePathname: navigationMocks.usePathname.mockReturnValue('/test-collection'),
    useParams: navigationMocks.useParams.mockReturnValue({ collection: ['test-collection'] }),
    useSearchParams: navigationMocks.useSearchParams.mockReturnValue(new URLSearchParams()),
}))

vi.mock('@/hooks/useProductFilters', () => {
    return {
        default: vi.fn().mockReturnValue(upfMocks),
    }
})

const ResizeObserverMock = vi.fn(() => ({
    observe: vi.fn(),
    unobserve: vi.fn(),
    disconnect: vi.fn(),
}))

vi.stubGlobal('ResizeObserver', ResizeObserverMock)

const maxPrice = 83.95
const openRefinements = ['Sort', 'Brand', 'Size', 'Color', 'Price']
const setOpenRefinements = vi.fn()

describe('CollectionSidebar', () => {
    it('renders and shows header content', async () => {
        const { getByText, unmount } = render(
            <CollectionSidebar
                maxPrice={maxPrice}
                openRefinements={openRefinements}
                setOpenRefinements={setOpenRefinements}
            />,
        )

        expect(getByText('Refine By:')).toBeVisible()
        unmount()
    })

    it('renders and shows CollectionSidebarMenu', () => {
        const { getByText, unmount } = render(
            <CollectionSidebar
                maxPrice={maxPrice}
                openRefinements={openRefinements}
                setOpenRefinements={setOpenRefinements}
            />,
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
                maxPrice={maxPrice}
                openRefinements={openRefinements}
                setOpenRefinements={setOpenRefinements}
            />,
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
                maxPrice={maxPrice}
                openRefinements={['Sort', 'Size', 'Color', 'Price']}
                setOpenRefinements={setOpenRefinements}
            />,
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
                    maxPrice={maxPrice}
                    openRefinements={['Sort']}
                    setOpenRefinements={setOpenRefinements}
                />,
            )

            expect(getByRole('radio', { name: 'Recommended' })).toHaveAttribute('checked')
            expect(getByText('Recommended')).toHaveClass('font-semibold')
            unmount()
        })

        it('has correct value when url params contains related search query', () => {
            navigationMocks.useSearchParams.mockReturnValueOnce(
                new URLSearchParams([['sortBy', 'priceLowToHigh']]) as ReadonlyURLSearchParams,
            )

            const { getByRole, getByText, unmount } = render(
                <CollectionSidebar
                    maxPrice={maxPrice}
                    openRefinements={['Sort']}
                    setOpenRefinements={setOpenRefinements}
                />,
            )

            expect(getByRole('radio', { name: 'Recommended' })).not.toHaveAttribute('checked')
            expect(getByText('Recommended')).not.toHaveClass('font-semibold')
            expect(getByRole('radio', { name: 'Price: Low to High' })).toHaveAttribute('checked')
            expect(getByText('Price: Low to High')).toHaveClass('font-semibold')
            unmount()
        })
    })

    describe('product checkbox filter', () => {
        it('is not checked when filter is not active', () => {
            const { getByRole, unmount } = render(
                <CollectionSidebar
                    maxPrice={maxPrice}
                    openRefinements={['Brand']}
                    setOpenRefinements={setOpenRefinements}
                />,
            )

            expect(getByRole('checkbox', { name: 'Brand 1' })).not.toHaveAttribute('checked')
            unmount()
        })

        it('is checked when filter is active', () => {
            upfMocks.selectedFilters = new Map([['brand', ['Brand 1']]])
            const { getByRole, unmount } = render(
                <CollectionSidebar
                    maxPrice={maxPrice}
                    openRefinements={['Brand']}
                    setOpenRefinements={setOpenRefinements}
                />,
            )

            expect(getByRole('checkbox', { name: 'Brand 1' })).toHaveAttribute('checked')
            unmount()

            upfMocks.selectedFilters = new Map()
        })
    })

    describe('product price range filter', () => {
        it('has default values when price is not filtered', () => {
            const { getByText, unmount } = render(
                <CollectionSidebar
                    maxPrice={maxPrice}
                    openRefinements={['Price']}
                    setOpenRefinements={setOpenRefinements}
                />,
            )

            expect(getByText('$0')).toBeVisible()
            expect(getByText('$85')).toBeVisible()
            unmount()
        })

        it('has correct values when price is filtered', () => {
            upfMocks.selectedFilters = new Map([['price', ['20', '75']]])

            const { queryByText, getByText, unmount } = render(
                <CollectionSidebar
                    maxPrice={maxPrice}
                    openRefinements={['Price']}
                    setOpenRefinements={setOpenRefinements}
                />,
            )

            expect(queryByText('$0')).not.toBeInTheDocument()
            expect(queryByText('$85')).not.toBeInTheDocument()
            expect(getByText('$20')).toBeVisible()
            expect(getByText('$75')).toBeVisible()
            unmount()

            upfMocks.selectedFilters = new Map()
        })
    })

    describe('checked product filter', () => {
        it('calls deselectToggleableFilter with correct values on click', async () => {
            upfMocks.selectedFilters = new Map([
                ['brand', ['Brand 1', 'Brand 2']],
                ['color', ['Color 1']],
            ])

            const { getByRole, unmount } = render(
                <CollectionSidebar
                    maxPrice={maxPrice}
                    openRefinements={['Brand']}
                    setOpenRefinements={setOpenRefinements}
                />,
            )

            await userEvent.click(getByRole('checkbox', { name: 'Brand 1' }))
            expect(upfMocks.deselectToggleableFilter).toHaveBeenCalledWith('brand', 'Brand 1')
            unmount()

            upfMocks.selectedFilters = new Map()
        })
    })

    describe('unchecked product filter', () => {
        it('calls selectToggleableFilter with correct values on click', async () => {
            const { getByRole, unmount } = render(
                <CollectionSidebar
                    maxPrice={maxPrice}
                    openRefinements={['Brand']}
                    setOpenRefinements={setOpenRefinements}
                />,
            )

            await userEvent.click(getByRole('checkbox', { name: 'Brand 1' }))
            expect(upfMocks.selectToggleableFilter).toHaveBeenCalledWith('brand', 'Brand 1')
            unmount()

            upfMocks.selectedFilters = new Map()
        })
    })
})
