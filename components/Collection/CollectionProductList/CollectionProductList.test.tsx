import { render } from '@testing-library/react'
import CollectionProductList, { CollectionProductListItem } from './CollectionProductList'

const testProducts = [
	{
		title: 'Test Product',
		handle: 'test-product',
		price: 59.95,
		featuredImage: {
			src: '/testUrl.com/testSrc',
			width: 50,
			height: 50,
		},
	},
	{
		title: 'Test Product 2',
		handle: 'test-product-2',
		price: 74.95,
		featuredImage: {
			src: '/testUrl.com/testSrc2',
			width: 50,
			height: 50,
		},
	},
]

describe('CollectionProductList', () => {
	it('renders and shows products correctly', () => {
		const { getAllByRole, getByText, unmount } = render(
			<CollectionProductList products={testProducts} />
		)

		testProducts.forEach((product, idx) => {
			expect(getByText(product.title)).toBeVisible()
			expect(getByText('$' + product.price.toString())).toBeVisible()
			expect(getAllByRole('img')[idx]).toHaveAttribute(
				'src',
				expect.stringContaining(encodeURIComponent(product.featuredImage.src))
			)
			expect(getAllByRole('img')[idx]).toHaveAttribute(
				'width',
				product.featuredImage.width.toString()
			)
			expect(getAllByRole('img')[idx]).toHaveAttribute(
				'height',
				product.featuredImage.height.toString()
			)
		})
		unmount()
	})
})

describe('CollectionProductListItem', () => {
	it('renders and shows product information', () => {
		const product = testProducts[0]
		const { getByText, unmount } = render(<CollectionProductListItem product={product} />)

		expect(getByText(product.title)).toBeVisible()
		expect(getByText('$' + product.price.toString())).toBeVisible()
		unmount()
	})

	it('renders product image correctly', () => {
		const product = testProducts[0]
		const { getByRole, unmount } = render(<CollectionProductListItem product={product} />)

		expect(getByRole('img')).toHaveAttribute(
			'src',
			expect.stringContaining(encodeURIComponent(product.featuredImage.src))
		)
		expect(getByRole('img')).toHaveAttribute('width', product.featuredImage.width.toString())
		expect(getByRole('img')).toHaveAttribute('height', product.featuredImage.height.toString())
		unmount()
	})

	it('links to product page', () => {
		const product = testProducts[0]
		const { getByRole, unmount } = render(<CollectionProductListItem product={product} />)

		expect(getByRole('link')).toHaveAttribute('href', '/shop/products/' + product.handle)
		unmount()
	})
})
