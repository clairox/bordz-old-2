import { GetProductQuery } from '@/__generated__/storefront/graphql'
import { renderHook } from '@testing-library/react'
import { useProduct } from './useProduct'

vi.mock('@apollo/client/react/hooks', () => ({
	useSuspenseQuery: vi.fn().mockReturnValue({
		data: {
			productByHandle: {
				description: 'Test description text',
				handle: 'test-product',
				id: 'product1',
				productType: 'product-type',
				title: 'Test Product',
				vendor: 'Test Vendor',
				images: {
					nodes: [
						{
							altText: 'image',
							src: '/testsrc.com/image1',
							width: 100,
							height: 100,
						},
					],
				},
				variants: {
					nodes: [
						{
							availableForSale: true,
							id: 'variant1',
							quantityAvailable: 20,
							title: '8.0',
							priceV2: {
								amount: '49.95',
								currencyCode: 'USD',
							},
						},
					],
				},
			},
		} as GetProductQuery,
	}),
}))

describe('useProduct', () => {
	it('fetches and processes product data correctly', () => {
		const { result } = renderHook(() => useProduct('test-product'))

		expect(result.current.product).toEqual({
			description: 'Test description text',
			handle: 'test-product',
			id: 'product1',
			images: [
				{
					altText: 'image',
					src: '/testsrc.com/image1',
					width: 100,
					height: 100,
				},
			],
			productType: 'product-type',
			title: 'Test Product',
			variants: [
				{
					availableForSale: true,
					compareAtPrice: undefined,
					id: 'variant1',
					price: {
						amount: 49.95,
						currencyCode: 'USD',
					},
					quantityAvailable: 20,
					title: '8.0',
				},
			],
			vendor: 'Test Vendor',
		})
	})
})
