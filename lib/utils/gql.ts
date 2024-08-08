import { GetCartQuery, GetCustomerQuery, GetProductQuery } from '@/__generated__/storefront/graphql'
import {
	Cart,
	CartLine,
	CartLineMerchandise,
	Customer,
	Image,
	MailingAddress,
	Money,
	Order,
	OrderCancelReason,
	OrderFinancialStatus,
	OrderFulfillmentStatus,
	OrderLineItem,
	Product,
	Variant,
} from '@/types/store'

export const ensureString = (value: any, defaultValue = ''): string =>
	typeof value === 'string' ? value : defaultValue

export const ensureNumber = (value: any, defaultValue = 0): number =>
	typeof value === 'number' ? value : defaultValue

export const ensureDate = (value: any, defaultValue = new Date()): Date =>
	value instanceof Date ? value : new Date(defaultValue)

export const ensureBoolean = (value: any, defaultValue = false): boolean =>
	typeof value === 'boolean' ? value : defaultValue

export const ensureNullableString = (value: any): string | undefined =>
	value ? String(value) : undefined

export const ensureArray = <T>(value: any, itemGuard: (item: any) => T): T[] =>
	Array.isArray(value) ? value.map(itemGuard) : []

export const ensureMoney = (value: any): Money => ({
	amount: ensureNumber(parseFloat(value?.amount)),
	currencyCode: ensureString(value?.currencyCode),
})

const ensureMailingAddress = (address: any): MailingAddress => ({
	address1: ensureString(address?.address1),
	address2: ensureString(address?.address2),
	city: ensureString(address?.city),
	country: ensureString(address?.country),
	formatted: ensureArray(address?.formatted.nodes, ensureString),
	formattedArea: ensureString(address?.formattedArea),
	firstName: ensureString(address?.firstName),
	id: ensureString(address?.id),
	name: ensureString(address?.name),
	phone: ensureString(address?.phone),
	provinceCode: ensureString(address?.provinceCode),
	zip: ensureString(address?.zip),
})

const ensureOrderLineItem = (item: any): OrderLineItem => ({
	currentQuantity: ensureNumber(item?.currentQuantity),
	quantity: ensureNumber(item?.quantity),
	title: ensureString(item?.title),
})

const ensureOrder = (order: any): Order => ({
	billingAddress: ensureMailingAddress(order?.billingAddress),
	cancelReason: order?.cancelReason
		? (ensureNullableString(order?.cancelReason) as OrderCancelReason)
		: undefined,
	canceledAt: order?.canceledAt ? new Date(order.canceledAt) : undefined,
	currencyCode: ensureString(order?.currencyCode),
	customerLocale: ensureString(order?.customerLocale),
	customerUrl: ensureNullableString(order?.customerUrl),
	edited: ensureBoolean(order?.edited),
	email: ensureString(order?.email),
	financialStatus: ensureString(order?.financialStatus) as OrderFinancialStatus,
	fulfillmentStatus: ensureString(order?.fulfillmentStatus) as OrderFulfillmentStatus,
	id: ensureString(order?.id),
	lineItems: ensureArray(order?.lineItems.nodes, ensureOrderLineItem),
	name: ensureString(order?.name),
	orderNumber: ensureString(order?.orderNumber),
	originalTotalPrice: ensureMoney(order?.originalTotalPrice),
	phone: ensureNullableString(order?.phone),
	processedAt: ensureDate(order?.processedAt),
	shippingAddress: ensureMailingAddress(order?.shippingAddress),
	statusUrl: ensureNullableString(order?.statusUrl),
	totalPrice: ensureMoney(order?.totalPrice),
	totalShippingPrice: ensureMoney(order?.totalShippingPrice),
})

const ensureImage = (image: any): Image => ({
	altText: image.altText ? ensureString(image?.altText) : undefined,
	height: ensureNumber(image?.height),
	src: ensureString(image?.src),
	width: ensureNumber(image?.width),
})

const ensureVariant = (variant: any): Variant => ({
	availableForSale: ensureBoolean(variant?.availableForSale),
	compareAtPrice: variant?.compareAtPriceV2 ? ensureMoney(variant?.compareAtPriceV2) : undefined,
	id: ensureString(variant?.id),
	price: ensureMoney(variant?.priceV2),
	quantityAvailable: ensureNumber(variant?.quantityAvailable),
	title: ensureString(variant?.title),
})

const ensureCartLineMerchandise = (merchandise: any): CartLineMerchandise => ({
	availableForSale: ensureBoolean(merchandise?.availableForSale),
	compareAtPrice: merchandise?.compareAtPriceV2
		? ensureMoney(merchandise?.compareAtPriceV2)
		: undefined,
	id: ensureString(merchandise?.id),
	price: ensureMoney(merchandise?.priceV2),
	product: {
		handle: ensureString(merchandise?.product?.handle),
		id: ensureString(merchandise?.product?.id),
		images: ensureArray(merchandise?.product?.images.nodes, ensureImage),
		title: ensureString(merchandise?.product?.title),
	},
	quantityAvailable: ensureNumber(merchandise?.quantityAvailable),
	title: ensureString(merchandise?.title),
})

const ensureCartLine = (line: any): CartLine => ({
	cost: {
		amountPerQuantity: ensureMoney(line?.cost.subtotalAmount),
		compareAtAmountPerQuantity: ensureMoney(line?.cost.totalAmount),
		subtotalAmount: ensureMoney(line?.cost.subtotalAmount),
		totalAmount: ensureMoney(line?.cost.totalAmount),
	},
	id: ensureString(line?.id),
	merchandise: ensureCartLineMerchandise(line?.merchandise),
	quantity: ensureNumber(line?.quantity),
})

const toSafeCustomer = (customer: GetCustomerQuery['customer']): Customer | null => {
	if (!customer) {
		return null
	}

	try {
		const safeCustomer: Customer = {
			acceptsMarketing: ensureBoolean(customer.acceptsMarketing),
			addresses: ensureArray(customer.addresses.nodes, ensureMailingAddress),
			createdAt: ensureDate(customer.createdAt),
			defaultAddress: customer.defaultAddress
				? ensureMailingAddress(customer.defaultAddress)
				: undefined,
			displayName: ensureString(customer.displayName),
			email: ensureString(customer.email),
			firstName: ensureString(customer.firstName),
			id: ensureString(customer.id),
			lastName: ensureString(customer.lastName),
			numberOfOrders: ensureNumber(customer.numberOfOrders),
			orders: ensureArray(customer.orders.nodes, ensureOrder),
			phone: ensureNullableString(customer.phone),
			tags: ensureArray(customer.tags, ensureString),
			updatedAt: ensureDate(customer.updatedAt),
		}

		return safeCustomer
	} catch (error) {
		console.error('Failed to convert customer:', error)
		return null
	}
}

const toSafeProduct = (product: GetProductQuery['productByHandle']): Product | null => {
	if (!product) {
		return null
	}

	try {
		const safeProduct: Product = {
			description: ensureString(product.description),
			handle: ensureString(product.handle),
			id: ensureString(product.id),
			images: ensureArray(product.images.nodes, ensureImage),
			productType: ensureString(product.productType),
			title: ensureString(product.title),
			variants: ensureArray(product.variants.nodes, ensureVariant),
			vendor: ensureString(product.vendor),
		}

		return safeProduct
	} catch (error) {
		console.error('Failed to convert product:', error)
		return null
	}
}

const toSafeCart = (cart: GetCartQuery['cart']): Cart | null => {
	if (!cart) {
		return null
	}

	try {
		const safeCart: Cart = {
			id: ensureString(cart.id),
			cost: {
				subtotalAmount: ensureMoney(cart.cost.subtotalAmount),
				totalAmount: ensureMoney(cart.cost.totalAmount),
			},
			lines: ensureArray(cart.lines.nodes, ensureCartLine),
			totalQuantity: ensureNumber(cart.totalQuantity),
		}

		return safeCart
	} catch (error) {
		console.error('Failed to convert cart:', error)
		return null
	}
}

export { toSafeCustomer, toSafeProduct, toSafeCart }
