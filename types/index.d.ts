export type Product = {
    id: number
    name: string
    handle: string
    price: number
    salePrice: number
    imageUrls: string[]
    size: string
    color: string
    description: string
    details: string[]
    quantity: number
    brand: string
    createdAt: Date
}

export type ProductListItem = {
    title: string
    handle: string
    price: number
    featuredImage: ImageData
}

export type ImageData = {
    src: string
    width: number
    height: number
    alt?: string
}

export type ProductFilterMap = Map<string, string[]>

export type CartItem = {
    id: number
    pid: number
    linePrice: number
    quantity: number
    createdAt: Date
    cartId: string
}

export type UnsavedCartItem = Omit<CartItem, 'id' | 'cartId', 'createdAt'>

export type CollectionTitle =
    | 'new'
    | 'skateboard-decks'
    | 'skateboard-trucks'
    | 'skateboard-wheels'
    | 'skateboard-bearings'
    | 'griptape'
    | 'hardware'

type FilterTag = {
    label: string
    key: string
    value: string | string[]
}

type LoginData = {
    email: string
    password: string
}

type SignupData = {
    email: string
    password: string
    firstName: string
    lastName: string
    birthDate: Date
    phone?: string
}

type CustomerAuthData = {
    id: string
    email: string
    firstName: string
    lastName: string
    displayName: string
}

type DateSelectProps = {
    value: Date | undefined
    onChange: (value: Date) => void
    minYear?: number
    maxYear?: number
}
