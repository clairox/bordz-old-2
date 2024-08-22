import { RequestCookies } from 'next/dist/compiled/@edge-runtime/cookies'
import { isNumeric, roundUp } from './number'
import { isAuthenticated } from './ssr'
import {
    getFilters,
    getFiltersFromSearchParam,
    getFiltersFromSearchParams,
    getFiltersServer,
    getSortKey,
    isValidPriceRange,
    mergeProductFilterMaps,
    processPriceParams,
} from '@/lib/core/collections'
import { ReadonlyURLSearchParams } from 'next/navigation'

const mocks = vi.hoisted(() => {
    return {
        cookiesMock: vi.fn(),
    }
})

vi.mock('next/headers', () => ({
    cookies: mocks.cookiesMock.mockReturnValue(new RequestCookies(new Headers())),
}))

describe('ssr utils', () => {
    test('isAuthenticated', () => {
        expect(isAuthenticated()).toEqual(false)

        mocks.cookiesMock.mockReturnValueOnce(
            new RequestCookies(new Headers([['cookie', 'customerAccessToken=testToken123']])),
        )
        expect(isAuthenticated()).toEqual(true)
    })
})

describe('number utils', () => {
    test('isNumeric', () => {
        expect(isNumeric('1')).toEqual(true)
        expect(isNumeric('12')).toEqual(true)
        expect(isNumeric('1.0')).toEqual(false)
        expect(isNumeric('abc')).toEqual(false)
        expect(isNumeric('a1')).toEqual(false)
        expect(isNumeric('1a')).toEqual(false)
        expect(isNumeric('')).toEqual(false)
        expect(isNumeric('0')).toEqual(true)
        expect(isNumeric('00')).toEqual(true)
    })

    test('roundUp', () => {
        expect(roundUp(1, 5)).toEqual(5)
        expect(roundUp(2, 5)).toEqual(5)
        expect(roundUp(7, 5)).toEqual(10)
        expect(roundUp(31, 5)).toEqual(35)
        expect(roundUp(12, 10)).toEqual(20)
        expect(roundUp(18, 200)).toEqual(200)
        expect(roundUp(200, 200)).toEqual(200)
        expect(roundUp(201, 200)).toEqual(400)
        expect(roundUp(0, 200)).toEqual(0)
    })
})

describe('collection utils', () => {
    test('getSortKey', () => {
        expect(getSortKey('recommended')).toEqual({ sortKey: 'BEST_SELLING', reverse: true })
        expect(getSortKey('newest')).toEqual({ sortKey: 'CREATED', reverse: false })
        expect(getSortKey('priceLowToHigh')).toEqual({ sortKey: 'PRICE', reverse: false })
        expect(getSortKey('priceHighToLow')).toEqual({ sortKey: 'PRICE', reverse: true })
        expect(getSortKey('other')).toEqual({ sortKey: 'BEST_SELLING', reverse: true })
        expect(getSortKey(null)).toEqual({ sortKey: 'BEST_SELLING', reverse: true })
    })

    test('getFiltersFromSearchParam', () => {
        expect(getFiltersFromSearchParam('Brand 1|Brand 2', 'brand')).toEqual([
            { productVendor: 'Brand 1' },
            { productVendor: 'Brand 2' },
        ])
        expect(getFiltersFromSearchParam('Size 1|Size 2', 'size')).toEqual([
            { variantOption: { name: 'size', value: 'Size 1' } },
            { variantOption: { name: 'size', value: 'Size 2' } },
        ])
        expect(getFiltersFromSearchParam('Color 1|Color 2', 'color')).toEqual([
            { productMetafield: { namespace: 'custom', key: 'color', value: 'Color 1' } },
            { productMetafield: { namespace: 'custom', key: 'color', value: 'Color 2' } },
        ])

        expect(getFiltersFromSearchParam('', 'brand')).toEqual([{ productVendor: '' }])
        expect(getFiltersFromSearchParam(null, 'brand')).toEqual([])
    })

    test('getFilters', () => {
        expect(
            getFilters(
                new ReadonlyURLSearchParams({
                    brand: 'Brand 1|Brand 2',
                    size: 'Size 1',
                    color: 'Color 1|Color 2',
                }),
                null,
            ),
        ).toEqual([
            { available: true },
            { productVendor: 'Brand 1' },
            { productVendor: 'Brand 2' },
            { variantOption: { name: 'size', value: 'Size 1' } },
            { productMetafield: { namespace: 'custom', key: 'color', value: 'Color 1' } },
            { productMetafield: { namespace: 'custom', key: 'color', value: 'Color 2' } },
        ])

        expect(
            getFilters(
                new ReadonlyURLSearchParams({
                    brand: 'Brand 1',
                    size: 'Size 1',
                    color: 'Color 1|Color 2',
                }),
                'Apples Subcollection',
            ),
        ).toEqual([
            { available: true },
            {
                productMetafield: {
                    namespace: 'custom',
                    key: 'subcategory',
                    value: 'Apples Subcollection',
                },
            },
            { productVendor: 'Brand 1' },
            { variantOption: { name: 'size', value: 'Size 1' } },
            { productMetafield: { namespace: 'custom', key: 'color', value: 'Color 1' } },
            { productMetafield: { namespace: 'custom', key: 'color', value: 'Color 2' } },
        ])

        expect(getFilters(new ReadonlyURLSearchParams(), null)).toEqual([{ available: true }])
    })

    test('getFiltersServer', () => {
        expect(
            getFiltersServer(
                {
                    brand: 'Brand 1|Brand 2',
                    size: 'Size 1',
                    color: 'Color 1|Color 2',
                },
                null,
            ),
        ).toEqual([
            { available: true },
            { productVendor: 'Brand 1' },
            { productVendor: 'Brand 2' },
            { variantOption: { name: 'size', value: 'Size 1' } },
            { productMetafield: { namespace: 'custom', key: 'color', value: 'Color 1' } },
            { productMetafield: { namespace: 'custom', key: 'color', value: 'Color 2' } },
        ])

        expect(
            getFiltersServer(
                {
                    brand: 'Brand 1',
                    size: 'Size 1',
                    color: 'Color 1|Color 2',
                },
                'Apples Subcollection',
            ),
        ).toEqual([
            { available: true },
            {
                productMetafield: {
                    namespace: 'custom',
                    key: 'subcategory',
                    value: 'Apples Subcollection',
                },
            },
            { productVendor: 'Brand 1' },
            { variantOption: { name: 'size', value: 'Size 1' } },
            { productMetafield: { namespace: 'custom', key: 'color', value: 'Color 1' } },
            { productMetafield: { namespace: 'custom', key: 'color', value: 'Color 2' } },
        ])

        expect(getFiltersServer({}, null)).toEqual([{ available: true }])
    })

    test('getFiltersFromSearchParams', () => {
        const map1 = Array.from(
            getFiltersFromSearchParams(
                new URLSearchParams({
                    brand: 'Brand 1|Brand 2',
                    size: 'Size 1',
                    color: 'Color 1|Color 2',
                    start: '40',
                    sortBy: 'newest',
                    priceMin: '25',
                    priceMax: '80',
                }),
            ).entries(),
        )
        expect(map1).toEqual([
            ['brand', ['Brand 1', 'Brand 2']],
            ['size', ['Size 1']],
            ['color', ['Color 1', 'Color 2']],
        ])

        const map2 = Array.from(
            getFiltersFromSearchParams(
                new URLSearchParams({
                    start: '40',
                    sortBy: 'newest',
                    priceMin: '25',
                    priceMax: '80',
                }),
            ).entries(),
        )
        expect(map2).toEqual([])

        const map3 = Array.from(getFiltersFromSearchParams(new URLSearchParams()).entries())
        expect(map3).toEqual([])
    })

    test('processPriceParams', () => {
        expect(processPriceParams('25', '80')).toEqual([25, 80])
        expect(processPriceParams('0', '80')).toEqual([0, 80])
        expect(processPriceParams('abc', '80')).toEqual([])
        expect(processPriceParams(null, '80')).toEqual([])
        expect(processPriceParams('', '80')).toEqual([])
        expect(processPriceParams('25', '0')).toEqual([])
        expect(processPriceParams('25', '10')).toEqual([])
        expect(processPriceParams('25', 'abc')).toEqual([])
        expect(processPriceParams('25', null)).toEqual([])
        expect(processPriceParams('25', '')).toEqual([])
        expect(processPriceParams('25', '25')).toEqual([])
        expect(processPriceParams('', '')).toEqual([])
        expect(processPriceParams('0', '0')).toEqual([])
        expect(processPriceParams('abc', 'abc')).toEqual([])
        expect(processPriceParams('-10', '5')).toEqual([])
        expect(processPriceParams('+10', '5')).toEqual([])
        expect(processPriceParams('10.5', '50')).toEqual([])
    })

    test('mergeProductFilterMaps', () => {
        const map1 = Array.from(
            mergeProductFilterMaps(
                new Map([
                    ['brand', ['Brand 1', 'Brand 2']],
                    ['color', ['Color 1']],
                ]),
                new Map([
                    ['brand', ['Brand 3']],
                    ['size', ['Size 1', 'Size 2']],
                ]),
            ).entries(),
        )
        expect(map1).toEqual([
            ['brand', ['Brand 1', 'Brand 2', 'Brand 3']],
            ['color', ['Color 1']],
            ['size', ['Size 1', 'Size 2']],
        ])

        const map2 = Array.from(
            mergeProductFilterMaps(
                new Map([
                    ['brand', ['Brand 1', 'Brand 2']],
                    ['color', ['Color 1']],
                ]),
                new Map(),
            ).entries(),
        )
        expect(map2).toEqual([
            ['brand', ['Brand 1', 'Brand 2']],
            ['color', ['Color 1']],
        ])

        const map3 = Array.from(mergeProductFilterMaps(new Map(), new Map()))
        expect(map3).toEqual([])
    })

    test('isValidPriceRange', () => {
        expect(isValidPriceRange([0, 5])).toEqual(true)
        expect(isValidPriceRange([10, 5])).toEqual(false)
        expect(isValidPriceRange([5, 5])).toEqual(false)
        expect(isValidPriceRange([0, 5, 10])).toEqual(false)
    })
})
