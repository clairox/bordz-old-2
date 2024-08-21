import { renderHook } from '@testing-library/react'
import useProductFilters from '@/hooks/useProductFilters'

const navigationMocks = vi.hoisted(() => ({
    useRouter: vi.fn(),
    usePathname: vi.fn(),
    useParams: vi.fn(),
    useSearchParams: vi.fn(),
    replace: vi.fn(),
    push: vi.fn(),
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

const searchParams = new URLSearchParams([
    ['brand', 'Brand 1,Brand 3'],
    ['price', '15,45'],
])

const restClient = vi.fn().mockReturnValue({
    data: {
        productFilters: [
            {
                key: 'brand',
                values: ['Brand 1', 'Brand 2', 'Brand 3'],
            },
            {
                key: 'color',
                values: ['Color 1', 'Color 2'],
            },
            {
                key: 'price',
                values: ['0', '100'],
            },
        ],
        selectedProductFilters: [
            {
                key: 'brand',
                values: ['Brand 2', 'Brand 3'],
            },
            {
                key: 'price',
                values: ['25', '80'],
            },
        ],
    },
})

describe('useProductFilters', () => {
    it.skip('returns correct values', () => {
        const { result } = renderHook(() => useProductFilters(searchParams))

        expect(result.current.filters).toEqual(
            new Map([
                ['brand', ['Brand 1', 'Brand 2', 'Brand 3']],
                ['color', ['Color 1', 'Color 2']],
                ['price', ['0', '100']],
            ]),
        )
        expect(result.current.selectedFilters).toEqual(
            new Map([
                ['brand', ['Brand 2', 'Brand 3']],
                ['price', ['25', '80']],
            ]),
        )
    })
})
