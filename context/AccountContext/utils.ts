import { GetCustomerQuery } from '@/__generated__/storefront/graphql'

type MailingAddress = {
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

type OrderCancelReason = 'CUSTOMER' | 'DECLINED' | 'FRAUD' | 'INVENTORY' | 'OTHER' | 'STAFF'

type OrderFinancialStatus =
	| 'AUTHORIZED'
	| 'PAID'
	| 'PARTIALLY_PAID'
	| 'PARTIALLY_REFUNDED'
	| 'PENDING'
	| 'REFUNDED'
	| 'VOIDED'

type OrderFulfillmentStatus =
	| 'FULFILLED'
	| 'IN_PROGRESS'
	| 'ON_HOLD'
	| 'OPEN'
	| 'PARTIALLY_FULFILLED'
	| 'PENDING_FULFILLMENT'
	| 'RESTOCKED'
	| 'SCHEDULED'
	| 'UNFULFILLED'

type OrderLineItem = {
	currentQuantity: number
	quantity: number
	title: string
}

type Money = {
	amount: number
	currencyCode: string
}

type Order = {
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

const ensureString = (value: any, defaultValue = ''): string =>
	typeof value === 'string' ? value : defaultValue
const ensureNumber = (value: any, defaultValue = 0): number =>
	typeof value === 'number' ? value : defaultValue
const ensureDate = (value: any, defaultValue = new Date()): Date =>
	value instanceof Date ? value : new Date(defaultValue)
const ensureBoolean = (value: any, defaultValue = false): boolean =>
	typeof value === 'boolean' ? value : defaultValue
const ensureNullableString = (value: any): string | undefined => (value ? String(value) : undefined)

const ensureArray = <T>(value: any, itemGuard: (item: any) => T): T[] =>
	Array.isArray(value) ? value.map(itemGuard) : []
const ensureMoney = (value: any): Money => ({
	amount: ensureNumber(value?.amount),
	currencyCode: ensureString(value?.currencyCode),
})

const ensureMailingAddress = (address: any): MailingAddress => ({
	address1: ensureString(address?.address1),
	address2: ensureString(address?.address2),
	city: ensureString(address?.city),
	country: ensureString(address?.country),
	formatted: ensureArray(address?.formatted, ensureString),
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
	lineItems: ensureArray(order?.lineItems, ensureOrderLineItem),
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

export const toSafeCustomer = (customer: GetCustomerQuery['customer']): Customer | null => {
	if (!customer) return null

	try {
		const safeCustomer: Customer = {
			acceptsMarketing: ensureBoolean(customer.acceptsMarketing),
			addresses: ensureArray(customer.addresses, ensureMailingAddress),
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
			orders: ensureArray(customer.orders, ensureOrder),
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
