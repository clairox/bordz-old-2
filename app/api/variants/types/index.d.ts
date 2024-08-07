import { Image } from '@/types/store'

export type GetProductVariants_Product = {
	featuredImage: Image
	handle: string
	id: string
	title: string
}

export type GetProductVariants_ProductVariant = {
	availableForSale: boolean
	compareAtPrice?: number
	id: string
	price: number
	product: GetProductVariants_Product
	selectedOptions: SelectedOption[]
	title: string
}
