import { render } from '@testing-library/react'
import ProductView from './ProductView'

vi.mock('next/navigation', () => ({
	useParams: vi.fn().mockReturnValue('test-product'),
}))

vi.mock('@/hooks/useProduct', () => ({
	useProduct: vi.fn().mockReturnValue({
		product: {
			description: 'Test description text',
			handle: 'test-product',
			id: 'product1',
			images: [
				{
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
		},
	}),
}))

describe('ProductView', () => {
	it('renders children', () => {
		const { getByRole } = render(<ProductView />)

		expect(getByRole('heading', { level: 1, name: 'Test Product' })).toBeVisible()
		expect(getByRole('img')).toBeVisible()
		expect(getByRole('img')).toHaveAttribute(
			'src',
			'/_next/image?url=%2Ftestsrc.com%2Fimage1&w=256&q=75'
		)
	})
})
