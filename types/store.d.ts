type MailingAddress = {
    address1: string
    address2?: string
    city: string
    country: string
    formatted: string[]
    formattedArea: string
    firstName: string
    id: string
    name: string
    phone?: string
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

type OrderLineItem = {
    currentQuantity: number
    quantity: number
    title: string
}

type Customer = {
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
    cartId: string
    birthDate: Date
    wishlist: string[]
}

export type Money = {
    amount: number
    currencyCode: string
}

export type Image = {
    altText?: string
    height: number
    src: string
    width: number
}

export type SelectedOption = {
    name: string
    value: string
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

export type Metafield = {
    key: string
    value: string
}

type UpdatePersonalInfoValues = Partial<{
    email: string
    firstName: string
    lastName: string
    birthDate: string
    phone: string
    addresses: MailingAddress[]
    defaultAddress: MailingAddress
}>

type UpdateCustomerValues = UpdatePersonalInfoValues & {
    cartId: string
    wishlist: string[]
    password: string
}

type ShopifyUserError = {
    code?: string | null
    field?: Array<string> | null
    message: string
}

type ProductListItem = {
    availableForSale: boolean
    featuredImage: Image
    handle: string
    id: string
    price: Money
    title: string
    totalInventory: number
    compareAtPrice?: Money
}

type WishlistItemProduct = {
    featuredImage: Image
    handle: string
    id: string
    title: string
}

type WishlistItem = {
    availableForSale: boolean
    id: string
    price: number
    title: string
    product: WishlistProduct
    selectedOptions: SelectedOption[]
    compareAtPrice?: number
}

type CollectionSortKeyAlias = 'recommended' | 'newest' | 'priceLowToHigh' | 'priceHighToLow'

type CollectionFilterKey = 'brand' | 'size' | 'color' | 'price' | 'subcategory'

type CollectionFilterValues = {
    brands: string[]
    sizes: string[]
    colors: string[]
    price: number[]
    subcategory?: string
}

type CollectionFilterObject =
    | { available: boolean }
    | { productVendor: string }
    | { variantOption: { name: 'size'; value: string } }
    | { productMetafield: { key: 'color'; namespace: 'custom'; value: string } }
    | { price: { min: number; max: number } }
    | { productMetafield: { namespace: 'custom'; key: 'subcategory'; value: string } }

type CollectionFilterArray = Partial<FilterObject[]>

type SortByKey = 'recommended' | 'newest' | 'priceLowToHigh' | 'priceHighToLow'

type AvailableFilter = {
    label: string
    values: Array<{
        label: string
        count: number
    }>
}
