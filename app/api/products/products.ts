import type { Product } from '@/types'

const d = [
	{
		name: 'Baker Hawk Overage 8.5" Skateboard Deck',
		handle: 'baker-hawk-overage-8-5-skateboard-deck',
		price: 7895,
		salePrice: 7895,
		imageUrls: [
			'https://scene7.zumiez.com/is/image/zumiez/product_main_medium_2x/Baker-Hawk-Overage-8.5%22-Skateboard-Deck-_372077-front-US.jpg',
			'https://scene7.zumiez.com/is/image/zumiez/product_main_medium_2x/Baker-Hawk-Overage-8.5%22-Skateboard-Deck-_372077-back-US.jpg',
		],
		size: '8.5"',
		color: 'Assorted',
		description:
			'The Overage 8.5" skateboard deck from Baker is a signature Riley Hawk pro model, featuring a black bottom ply with red and yellow sketched branding. The 7-ply maple construction is finished with a medium concave.',
		details: [
			'Signature Riley Hawk pro model',
			'7-ply maple construction',
			'Mellow concave',
			'Mild pitched kick tails',
			'Width: 8.5"',
			'Length: 32"',
			'Wheelbase: 14.5"',
		],
		quantity: 10,
		brand: 'Baker',
	},
	{
		name: 'Girl x Hello Kitty and Friends Carroll Hello Kitty 8.0" Skateboard Deck',
		handle: 'girl-x-sanrio-carroll-hello-kitty-and-friends-hello-kitty-8-0-skateboard-deck',
		price: 6495,
		salePrice: 6495,
		imageUrls: [
			'https://scene7.zumiez.com/is/image/zumiez/product_main_medium_2x/Girl-x-Hello-Kitty-and-Friends-Carroll-Hello-Kitty-8.0%22-Skateboard-Deck-_381975-front.jpg',
			'https://scene7.zumiez.com/is/image/zumiez/product_main_medium_2x/Girl-x-Hello-Kitty-and-Friends-Carroll-Hello-Kitty-8.0%22-Skateboard-Deck-_381975-back.jpg',
		],
		size: '8.0"',
		color: 'Red',
		description:
			'Girl Skateboards collaborates with Sanrio\'s Hello Kitty and Friends for the Carroll Hello Kitty 8.0" deck, featuring a red floral pattern. The bottom ply boasts a cute Hello Kitty design with raised detailing, while various Sanrio characters are displayed on top. Made with a quality 7-ply maple construction, the collaborative deck is finished with a medium concave profile.',
		details: [
			'Official Girl & Hello Kitty and Friends collaboration',
			'Signature Mike Carroll pro model',
			'7-ply maple construction',
			'Width: 8.50',
			'Length: 31.875"',
			'Wheelbase: 14.25"',
		],
		quantity: 5,
		brand: 'Girl',
	},
	{
		name: 'Santa Cruz Asta Cosmic Twin 8.2" Skateboard Deck',
		handle: 'santa-cruz-asta-cosmic-twin-8-2-skateboard-deck',
		price: 6795,
		salePrice: 6795,
		imageUrls: [
			'https://scene7.zumiez.com/is/image/zumiez/product_main_medium_2x/Santa-Cruz-Asta-Cosmic-Twin-8.2%22-Skateboard-Deck-_380991-front-US.jpg',
		],
		size: '8.2"',
		color: 'Assorted',
		description:
			'Presented by Santa Cruz with a symmetrical "Twin Tip" shape, the signature Tom Asta Cosmic Twin 8.2" skateboard deck arrives in Tom\'s favorite size using a 32" length with a 14.2" wheelbase. Featuring a mirrored graphic with the same image on the nose as the tail, the unique signature deck offers an advantage to skating switch stance lending the same attributes either way.',
		details: [
			'Signature Tom Asta pro model',
			'7-ply maple construction',
			'Width: 8.2"',
			'Length: 32"',
			'Wheelbase: 14.2"',
		],
		quantity: 14,
		brand: 'Santa Cruz',
	},
	{
		name: 'DGK Boo Krazy 8.25" Skateboard Deck',
		handle: 'dgk-boo-krazy-8-25-skateboard-deck',
		price: 6495,
		salePrice: 6495,
		imageUrls: [
			'https://scene7.zumiez.com/is/image/zumiez/product_main_medium_2x/DGK-Boo-Krazy-8.25%22-Skateboard-Deck-_386241-front-US.jpg',
			'https://scene7.zumiez.com/is/image/zumiez/product_main_medium_2x/DGK-Boo-Krazy-8.25%22-Skateboard-Deck-_386241-back-US.jpg',
		],
		size: '8.25"',
		color: 'Red',
		description:
			'A signature Boo Johnson pro model for DGK, the Krazy 8.25" skateboard deck features a smiling portrait on the bottom ply - taking inspiration from famous contemporary art. With a 7-ply maple construction and a mellow concave profile, the DGK deck comes finished with additional branding on the top ply.',
		details: [
			'Signature Boo Johnson pro model',
			'7-ply maple construction',
			'Mellow concave',
			'Mild pitched kick tails',
			'Width: 8.25"',
			'Length: 32.5"',
			'Wheelbase: 14.31"',
		],
		quantity: 2,
		brand: 'DGK',
	},
	{
		name: 'Baker White Brand Logo 8.25" Skateboard Deck',
		handle: 'baker-white-brand-logo-8-25-skateboard-deck',
		price: 7895,
		salePrice: 7895,
		imageUrls: [
			'https://scene7.zumiez.com/is/image/zumiez/product_main_medium_2x/Baker-White-Brand-Logo-8.25%22-Skateboard-Deck-_356011-front-US.jpg',
			'https://scene7.zumiez.com/is/image/zumiez/product_main_medium_2x/Baker-White-Brand-Logo-8.25%22-Skateboard-Deck-_356011-back-US.jpg',
		],
		size: '8.25"',
		color: 'Red',
		description:
			"Blend some statement-making branding into your next build with Baker's White Logo 8.25\" skateboard deck! Wide enough for larger-footed, wider-stanced riders to stand comfortably, the board's 8.25\" width and mellow concave keep it stable and cruise-friendly, while the wide, pitched ends provide plenty of pop. Baker's logo sits at the board's bottom ply, spelled out in blocky white lettering, lending the board a splash of not-so-subtle skate-infused style.",
		details: [
			'7-ply maple construction',
			'Mild concave profile',
			'Mild pitched kick tails',
			'Width: 8.25"',
			'Length: 31.75"',
			'Wheelbase: 14.25"',
		],
		quantity: 10,
		brand: 'Baker',
	},
]

export const data: Product[] = [...d, ...d, ...d].map((product, idx) => {
	return { id: idx + 1, ...product, createdAt: new Date(Date.now() + idx) }
})
