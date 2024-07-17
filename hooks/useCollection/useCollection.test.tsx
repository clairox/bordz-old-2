import { GetCollectionQuery, ProductCollectionSortKeys } from '@/__generated__/graphql'
import { renderHook } from '@testing-library/react'
import { useCollection } from './useCollection'

vi.mock('@apollo/client/react/hooks', () => ({
	useSuspenseQuery: vi.fn().mockReturnValue({
		data: {
			collection: {
				title: 'Test Collection',
				products: {
					nodes: [
						{
							title: 'Product 1',
							handle: 'product-1',
							priceRange: {
								maxVariantPrice: {
									amount: 83.95,
								},
							},
							featuredImage: {
								src: 'image1.jpg',
								width: 100,
								height: 100,
							},
						},
					],
					pageInfo: {
						hasNextPage: false,
					},
					filters: [
						{
							label: 'Availability',
							values: [
								{
									label: 'In stock',
									count: 10,
								},
							],
						},
						{
							label: 'Subcollection',
							values: [
								{
									label: 'Subcollection 1',
									count: 6,
								},
								{
									label: 'Subcollection 2',
									count: 9,
								},
							],
						},
						{
							label: 'Brand',
							values: [
								{ label: 'Brand 1', count: 10 },
								{ label: 'Brand 2', count: 5 },
							],
						},
						{
							label: 'Price',
							values: [
								{
									label: 'Price',
									input: '{"price":{"min":0,"max":85}}',
									count: 15,
								},
							],
						},
					],
				},
			},
		} as GetCollectionQuery,
	}),
}))

describe('useCollection', () => {
	it('fetches and processes collection data correctly', () => {
		const { result } = renderHook(() =>
			useCollection('test-collection', 40, ProductCollectionSortKeys.BestSelling, [])
		)

		expect(result.current.collection).toBeDefined()
		expect(result.current.renderableProducts).toEqual([
			{
				title: 'Product 1',
				handle: 'product-1',
				price: 83.95,
				featuredImage: {
					src: 'image1.jpg',
					width: 100,
					height: 100,
				},
			},
		])
		expect(result.current.productCount).toBe(10)
		expect(result.current.availableFilters).toEqual([
			{ label: 'brand', values: ['Brand 1', 'Brand 2'] },
		])
		expect(result.current.filteredPriceRange).toEqual([0, 85])
		expect(result.current.subcollectionTitles).toEqual(['Subcollection 1', 'Subcollection 2'])
		expect(result.current.hasNextPage).toBe(false)
		expect(result.current.error).toBeUndefined()
	})
})
