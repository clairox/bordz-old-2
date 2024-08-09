import { Image, Money } from '@/types/store'

type FilterKey = 'brand' | 'size' | 'color' | 'price' | 'subcategory'

type FilterValues = {
	brands: string[]
	sizes: string[]
	colors: string[]
	price: number[]
	subcategory?: string
}

type FilterObject =
	| { available: boolean }
	| { productVendor: string }
	| { variantOption: { name: 'size'; value: string } }
	| { productMetafield: { key: 'color'; namespace: 'custom'; value: string } }
	| { price: { min: number; max: number } }
	| { productMetafield: { namespace: 'custom'; key: 'subcategory'; value: string } }

type FilterArray = Partial<FilterObject[]>

type SortByKey = 'recommended' | 'newest' | 'priceLowToHigh' | 'priceHighToLow'

type ProductListItem = {
	availableForSale: boolean
	description: string
	featuredImage: Image
	handle: string
	id: string
	price: Money
	title: string
	totalInventory: number
	compareAtPrice?: Money
}

type AvailableFilter = {
	label: string
	values: Array<{
		label: string
		count: number
	}>
}
