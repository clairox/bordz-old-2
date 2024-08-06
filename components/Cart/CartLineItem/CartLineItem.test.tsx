import { render } from '@testing-library/react'
import CartLineItem from './CartLineItem'
import userEvent from '@testing-library/user-event'

const mocks = vi.hoisted(() => {
	return {
		updateCartLine: vi.fn(),
		deleteCartLine: vi.fn(),
	}
})

vi.mock('@/context/CartContext', () => ({
	useCartContext: vi.fn().mockReturnValue({
		updateCartLine: mocks.updateCartLine,
		deleteCartLine: mocks.deleteCartLine,
	}),
}))

describe('CartCartLine', () => {
	const cost = {
		amountPerQuantity: {
			amount: 49.95,
			currencyCode: 'USD',
		},
		subtotalAmount: {
			amount: 99.9,
			currencyCode: 'USD',
		},
		totalAmount: {
			amount: 99.9,
			currencyCode: 'USD',
		},
	}
	const lineId = 'line1'
	const merchandise = {
		availableForSale: true,
		id: 'variant1',
		price: {
			amount: 49.95,
			currencyCode: 'USD',
		},
		quantityAvailable: 5,
		title: '8.0',
		product: {
			handle: 'product-1',
			id: 'product1',
			images: [
				{
					src: '/testsrc.com/product1',
					width: 100,
					height: 100,
				},
			],
			title: 'Product 1',
		},
	}
	const quantity = 3
	it('renders cart line data', () => {
		const { getByRole, getByText } = render(
			<CartLineItem cost={cost} lineId={lineId} merchandise={merchandise} quantity={quantity} />
		)

		expect(getByRole('heading', { level: 1, name: 'Product 1' })).toBeVisible()
		expect(getByText('8.0')).toBeVisible()
		expect(getByText('$99.90')).toBeVisible()
		expect(getByRole('textbox')).toHaveValue('3')
	})

	describe('line item quantity counter', () => {
		it('calls updateCartLine with correct values on change', async () => {
			const { getByTestId } = render(
				<CartLineItem cost={cost} lineId={lineId} merchandise={merchandise} quantity={quantity} />
			)

			await userEvent.click(getByTestId('decrementButton'))
			expect(mocks.updateCartLine).toHaveBeenCalledWith('line1', { quantity: 2 })
		})
	})

	describe('delete line item button', () => {
		it('calls deleteCartLine with correct values on click', async () => {
			const { getByTestId } = render(
				<CartLineItem cost={cost} lineId={lineId} merchandise={merchandise} quantity={quantity} />
			)

			await userEvent.click(getByTestId('deleteButton'))
			expect(mocks.deleteCartLine).toHaveBeenCalledWith('line1')
		})
	})
})
