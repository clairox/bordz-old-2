import {
    ensureArray,
    ensureBoolean,
    ensureDate,
    ensureMoney,
    ensureNullableDate,
    ensureNullableString,
    ensureNumber,
    ensureString,
} from './typeGuards'
import {
    Customer,
    MailingAddress,
    Order,
    OrderCancelReason,
    OrderFinancialStatus,
    OrderFulfillmentStatus,
    OrderLineItem,
} from '@/types/store'

const ensureMailingAddress = (address: any): MailingAddress => ({
    address1: ensureString(address.address1),
    address2: ensureNullableString(address.address2),
    city: ensureString(address.city),
    country: ensureString(address.country),
    formatted: ensureArray(address.formatted.nodes, ensureString),
    formattedArea: ensureString(address.formattedArea),
    firstName: ensureString(address.firstName),
    id: ensureString(address.id),
    name: ensureString(address.name),
    phone: ensureNullableString(address.phone),
    provinceCode: ensureString(address.provinceCode),
    zip: ensureString(address.zip),
})

const ensureOrderLineItem = (item: any): OrderLineItem => ({
    currentQuantity: ensureNumber(item?.currentQuantity),
    quantity: ensureNumber(item?.quantity),
    title: ensureString(item?.title),
})

const ensureOrder = (order: any): Order => ({
    billingAddress: ensureMailingAddress(order.billingAddress),
    cancelReason: ensureNullableString(order.cancelReason) as OrderCancelReason,
    canceledAt: ensureNullableDate(order.canceledAt),
    currencyCode: ensureString(order.currencyCode),
    customerLocale: ensureString(order.customerLocale),
    customerUrl: ensureNullableString(order.customerUrl),
    edited: ensureBoolean(order.edited),
    email: ensureString(order.email),
    financialStatus: ensureString(order.financialStatus) as OrderFinancialStatus,
    fulfillmentStatus: ensureString(order.fulfillmentStatus) as OrderFulfillmentStatus,
    id: ensureString(order.id),
    lineItems: ensureArray(order.lineItems.nodes, ensureOrderLineItem),
    name: ensureString(order.name),
    orderNumber: ensureString(order.orderNumber),
    originalTotalPrice: ensureMoney(order.originalTotalPrice),
    phone: ensureNullableString(order.phone),
    processedAt: ensureDate(order.processedAt),
    shippingAddress: ensureMailingAddress(order.shippingAddress),
    statusUrl: ensureNullableString(order.statusUrl),
    totalPrice: ensureMoney(order.totalPrice),
    totalShippingPrice: ensureMoney(order.totalShippingPrice),
})

export const validateCustomer = (customer: any): Customer => {
    const error = new Error('Safe customer conversion failed')
    if (!customer) {
        console.error(error)
        throw error
    }

    const metafields = customer.metafields
    const cartIdMetafield = metafields.find((metafield: any) => metafield.key === 'cartid')
    const birthDateMetafield = metafields.find((metafield: any) => metafield.key === 'birthdate')
    const wishlistMetafield = metafields.find((metafield: any) => metafield.key === 'wishlist')

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
            numberOfOrders: ensureNumber(Number(customer.numberOfOrders)),
            orders: ensureArray(customer.orders.nodes, ensureOrder),
            phone: ensureNullableString(customer.phone),
            tags: ensureArray(customer.tags, ensureString),
            updatedAt: ensureDate(customer.updatedAt),
            cartId: ensureString(cartIdMetafield.value),
            birthDate: ensureDate(birthDateMetafield.value),
            wishlist: ensureArray(JSON.parse(wishlistMetafield.value), ensureString),
        }

        return safeCustomer
    } catch (error) {
        console.error(error)
        throw error
    }
}
