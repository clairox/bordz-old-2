export type Variant = {
	availableForSale: boolean
	compareAtPrice?: Money
	id: string
	price: Money
	quantityAvailable: number
	title: string
}

type Product = {
	description: string
	handle: string
	id: string
	images: Image[]
	productType: string
	title: string
	variants: Variant[]
	vendor: string
}
