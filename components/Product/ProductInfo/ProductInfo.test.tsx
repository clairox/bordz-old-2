import { Variant } from '@/types/store'
import { render } from '@testing-library/react'
import ProductInfo from './ProductInfo'
import userEvent from '@testing-library/user-event'

describe('ProductInfo', () => {
	const id = 'product1'
	const title = 'Test Product'
	const description = 'Test description filled with tons of text'
	const variants: Variant[] = [
		{
			availableForSale: true,
			id: 'variant1',
			quantityAvailable: 20,
			title: '8.0',
			price: { amount: 59.95, currencyCode: 'USD' },
		},
		{
			availableForSale: true,
			id: 'variant2',
			quantityAvailable: 15,
			title: '8.25',
			price: { amount: 39.95, currencyCode: 'USD' },
		},
	]

	it('renders product info correctly', () => {
		const { getByRole, getByText, queryByText } = render(
			<ProductInfo id={id} title={title} description={description} variants={variants} />
		)

		expect(getByRole('heading', { level: 1, name: 'Test Product' })).toBeVisible()
		expect(getByText('$59.95')).toBeVisible()
		expect(queryByText('$39.95')).not.toBeInTheDocument()
		expect(getByText('Test description filled with tons of text')).toBeVisible()
	})

	it('renders variant options correctly', () => {
		const { getByText } = render(
			<ProductInfo id={id} title={title} description={description} variants={variants} />
		)

		expect(getByText('8.0')).toHaveClass('bg-black text-white cursor-default')
		expect(getByText('8.25')).toHaveClass('cursor-pointer hover:bg-gray-100')
	})

	it('updates variant option selection on click', async () => {
		const { getByText, queryByText } = render(
			<ProductInfo id={id} title={title} description={description} variants={variants} />
		)

		const firstVariantOption = getByText('8.0')
		const secondVariantOption = getByText('8.25')

		expect(getByText('$59.95')).toBeVisible()
		expect(queryByText('$39.95')).not.toBeInTheDocument()
		expect(firstVariantOption).toHaveClass('bg-black text-white cursor-default')
		expect(secondVariantOption).toHaveClass('cursor-pointer hover:bg-gray-100')

		await userEvent.click(secondVariantOption)

		expect(queryByText('$59.95')).not.toBeInTheDocument()
		expect(getByText('$39.95')).toBeVisible()
		expect(firstVariantOption).toHaveClass('cursor-pointer hover:bg-gray-100')
		expect(secondVariantOption).toHaveClass('bg-black text-white cursor-default')
	})
})
