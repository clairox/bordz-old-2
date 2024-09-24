import { render } from '@testing-library/react'
import FilterChips from './FilterChips'
import { FilterGroup } from '@/types/store'

vi.mock('next/navigation', () => ({
    useSearchParams: vi.fn().mockReturnValue(new URLSearchParams()),
}))

vi.mock('@/hooks', () => ({
    useDeselectFilterOption: vi.fn(),
    useRefineSearchParams: vi.fn(),
    useSetPriceFilter: vi.fn(),
}))

describe('FilterChips', () => {
    const filterGroups: FilterGroup[] = [
        {
            groupName: 'brand',
            isActive: true,
            options: [
                {
                    name: 'Brand 1',
                    isSelected: true,
                },
            ],
        },
        {
            groupName: 'size',
            isActive: true,
            options: [
                {
                    name: 'Size 1',
                    isSelected: true,
                },
                {
                    name: 'Size 2',
                    isSelected: false,
                },
                {
                    name: 'Size 3',
                    isSelected: true,
                },
            ],
        },
        {
            groupName: 'color',
            isActive: false,
            options: [
                {
                    name: 'Color 1',
                    isSelected: false,
                },
            ],
        },
    ]

    it('renders chips correctly', () => {
        const { queryAllByRole } = render(
            <FilterChips filterGroups={filterGroups} totalProductCount={50} maxPrice={100} />,
        )

        const chips = queryAllByRole('button').slice(1)
        expect(chips[0]).toHaveTextContent('Brand 1')
        expect(chips[1]).toHaveTextContent('Size 1')
        expect(chips[2]).toHaveTextContent('Size 3')
        expect(chips[3]).toBeUndefined()
    })
})
