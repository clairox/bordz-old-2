import { render } from '@testing-library/react'
import CollectionProductList, { CollectionProductListItem } from './CollectionProductList'
import type { ProductListItem } from '@/types/store'

const testProducts: ProductListItem[] = [
    {
        id: '1',
        title: 'Test Product',
        handle: 'test-product',
        price: {
            amount: 59.95,
            currencyCode: 'USD',
        },
        availableForSale: true,
        totalInventory: 20,
        featuredImage: {
            src: '/testUrl.com/testSrc',
            width: 50,
            height: 50,
        },
    },
    {
        id: '2',
        title: 'Test Product 2',
        handle: 'test-product-2',
        price: {
            amount: 74.95,
            currencyCode: 'USD',
        },
        availableForSale: true,
        totalInventory: 20,
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
            <CollectionProductList products={testProducts} loading={false} />,
        )

        testProducts.forEach((product, idx) => {
            expect(getByText(product.title)).toBeVisible()
            expect(getByText('$' + product.price.amount.toString())).toBeVisible()
            expect(getAllByRole('img')[idx]).toHaveAttribute(
                'src',
                expect.stringContaining(encodeURIComponent(product.featuredImage.src)),
            )
            expect(getAllByRole('img')[idx]).toHaveAttribute(
                'width',
                product.featuredImage.width.toString(),
            )
            expect(getAllByRole('img')[idx]).toHaveAttribute(
                'height',
                product.featuredImage.height.toString(),
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
        expect(getByText('$' + product.price.amount.toString())).toBeVisible()
        unmount()
    })

    it('renders product image correctly', () => {
        const product = testProducts[0]
        const { getByRole, unmount } = render(<CollectionProductListItem product={product} />)

        expect(getByRole('img')).toHaveAttribute(
            'src',
            expect.stringContaining(encodeURIComponent(product.featuredImage.src)),
        )
        expect(getByRole('img')).toHaveAttribute('width', product.featuredImage.width.toString())
        expect(getByRole('img')).toHaveAttribute('height', product.featuredImage.height.toString())
        unmount()
    })

    it('links to product page', () => {
        const product = testProducts[0]
        const { getByRole, unmount } = render(<CollectionProductListItem product={product} />)

        expect(getByRole('link')).toHaveAttribute('href', '/products/' + product.handle)
        unmount()
    })
})
