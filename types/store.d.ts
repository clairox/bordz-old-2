import { Money } from '@phosphor-icons/react'

export type MailingAddress = {
	address1: string
	address2: string
	city: string
	country: string
	formatted: string[]
	formattedArea: string
	firstName: string
	id: string
	name: string
	phone: string
	provinceCode: string
	zip: string
}

export type OrderCancelReason = 'CUSTOMER' | 'DECLINED' | 'FRAUD' | 'INVENTORY' | 'OTHER' | 'STAFF'

export type OrderFinancialStatus =
	| 'AUTHORIZED'
	| 'PAID'
	| 'PARTIALLY_PAID'
	| 'PARTIALLY_REFUNDED'
	| 'PENDING'
	| 'REFUNDED'
	| 'VOIDED'

export type OrderFulfillmentStatus =
	| 'FULFILLED'
	| 'IN_PROGRESS'
	| 'ON_HOLD'
	| 'OPEN'
	| 'PARTIALLY_FULFILLED'
	| 'PENDING_FULFILLMENT'
	| 'RESTOCKED'
	| 'SCHEDULED'
	| 'UNFULFILLED'

export type OrderLineItem = {
	currentQuantity: number
	quantity: number
	title: string
}

export type Money = {
	amount: number
	currencyCode: string
}

export type Order = {
	billingAddress: MailingAddress
	cancelReason?: OrderCancelReason
	canceledAt?: Date
	currencyCode: string
	customerLocale: string
	customerUrl?: string
	edited: boolean
	email: string
	financialStatus: OrderFinancialStatus
	fulfillmentStatus: OrderFulfillmentStatus
	id: string
	lineItems: OrderLineItem[]
	name: string
	orderNumber: string
	originalTotalPrice: Money
	phone?: string
	processedAt: Date
	shippingAddress: MailingAddress
	statusUrl?: string
	totalPrice: Money
	totalShippingPrice: Money
}

export type Customer = {
	acceptsMarketing: boolean
	addresses: MailingAddress[]
	createdAt: Date
	defaultAddress?: MailingAddress
	displayName: string
	email: string
	firstName: string
	id: string
	lastName: string
	numberOfOrders: number
	orders: Order[]
	phone?: string
	tags: string[]
	updatedAt: Date
}

export type Image = {
	altText?: string
	height: number
	src: string
	width: number
}

export type Variant = {
	availableForSale: boolean
	compareAtPrice?: Money
	id: string
	price: Money
	quantityAvailable: number
	title: string
}

export type Product = {
	description: string
	handle: string
	id: string
	images: Image[]
	productType: string
	title: string
	variants: Variant[]
	vendor: string
}

export type CartLineMerchandise = Variant & {
	product: Omit<Product, 'description' | 'productType' | 'variants' | 'vendor'>
}

export type CartLine = {
	cost: {
		amountPerQuantity: Money
		compareAtAmountPerQuantity?: Money
		subtotalAmount: Money
		totalAmount: Money
	}
	id: string
	merchandise: CartLineMerchandise
	quantity: number
}

export type Cart = {
	id: string
	cost: {
		subtotalAmount: Money
		totalAmount: Money
	}
	lines: CartLine[]
	totalQuantity: number
}
