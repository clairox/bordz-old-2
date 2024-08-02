import { GetCollectionMaxPriceQuery } from '@/__generated__/storefront/graphql'
import { renderHook } from '@testing-library/react'
import { useCollectionMaxPrice } from './useCollectionMaxPrice'

vi.mock('@apollo/client/react/hooks', () => ({
	useSuspenseQuery: vi.fn().mockReturnValue({
		data: {
			collection: {
				products: {
					nodes: [
						{
							priceRange: {
								maxVariantPrice: {
									amount: 83.95,
								},
							},
						},
						{
							priceRange: {
								maxVariantPrice: {
									amount: 108.95,
								},
							},
						},
						{
							priceRange: {
								maxVariantPrice: {
									amount: 27.95,
								},
							},
						},
					],
				},
			},
		} as GetCollectionMaxPriceQuery,
	}),
}))

describe('useCollectionMaxPrice', () => {
	it('fetches and processes collection max price data correctly', () => {
		const { result } = renderHook(() => useCollectionMaxPrice('test-collection', 40, []))

		expect(result.current.maxPrice).toEqual(108.95)
		expect(result.current.error).toBeUndefined()
	})
})
