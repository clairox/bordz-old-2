'use client'
import { Button } from '@/components/UI/Button'
import { useCartContext } from '@/context/CartContext'
import { fetcher } from '@/lib/fetcher'
import { MAX_PRODUCTS_PER_LOAD } from '@/lib/utils/collection'
import { getLocalWishlist, removeWishlistItem } from '@/lib/utils/wishlist'
import { Trash } from '@phosphor-icons/react'
import _ from 'lodash'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import React, { useEffect, useState, useCallback } from 'react'
import { GetProductVariants_ProductVariant } from '../api/variants/types'
import { Image as ProductImage } from '@/types/store'

const Page = () => {
	const router = useRouter()
	const searchParams = useSearchParams()

	const { addCartLine } = useCartContext()

	const limit = _.toInteger(searchParams.get('start') || MAX_PRODUCTS_PER_LOAD)

	const [productVariants, setProductVariants] = useState<
		GetProductVariants_ProductVariant[] | undefined
	>(undefined)
	const [hasNextPage, setHasNextPage] = useState<boolean | undefined>(undefined)
	const [loading, setLoading] = useState(true)

	const loadVariants = useCallback(async () => {
		const wishlist = getLocalWishlist()
		if (wishlist.length === 0) {
			setProductVariants([])
			return
		}

		try {
			const response = await fetcher(`/variants`, {
				method: 'POST',
				body: JSON.stringify({
					ids: wishlist,
					limit,
				}),
			})

			setProductVariants(response.data.variants)
			setHasNextPage(response.data.hasNextPage)
		} catch (error) {
			// TODO redirect to 500 error page
			console.error(error)
		}

		setLoading(false)
	}, [limit])

	useEffect(() => {
		loadVariants()
	}, [loadVariants])

	const handleAddItemToCart = async (id: string, title: string, image: ProductImage) => {
		const itemAdded = addCartLine(id, 1)
		if (!itemAdded) {
			// TODO toast('An error has occurred while adding item to cart. Please try again')
			return
		}
		// TODO toast(`${title} added to cart`, image)
		handleRemoveItem(id)
	}

	const handleRemoveItem = async (id: string) => {
		const itemRemoved = await removeWishlistItem(id)
		if (!itemRemoved) {
			// TODO toast('An error has occurred while removing item. Please try again.')
			return
		}
		loadVariants()
	}

	if (productVariants == undefined) {
		return <div>Loading...</div>
	}

	if (productVariants.length === 0) {
		return <div>Wishlist is empty</div>
	}

	return (
		<div>
			<h1>Wishlist</h1>
			<main className="grid grid-cols-4 border-l border-black">
				{productVariants.map(variant => {
					const { id, title, price, product, selectedOptions } = variant
					const { name: variantName, value: variantValue } = selectedOptions[0]
					return (
						<article key={product.handle} className="border-r border-b border-black">
							<Link href={`/products/${product.handle}`}>
								<div className="relative border-b border-gray">
									<Image
										src={product.featuredImage?.src}
										alt="skateboard deck graphic"
										width={product.featuredImage?.width!}
										height={product.featuredImage?.height!}
									/>
									<div
										className="absolute top-0 right-0 flex justify-center items-center m-3 w-10 h-10 rounded-full bg-white"
										onClick={e => {
											e.preventDefault()
											handleRemoveItem(id)
										}}
									>
										<Trash size={30} weight={'light'} />
									</div>
								</div>
								<div className="px-4 pt-4 pb-2 leading-5 tracking-tight">
									<div className="h-12">
										<p className="line-clamp-2">{product.title}</p>
									</div>
									<div className="mb-1 text-gray-600">
										{variantName}: {variantValue}
									</div>
									<div className="font-semibold text-lg">${price}</div>
								</div>
								<div className="w-full h-14">
									<Button
										className="w-full h-full border-t border-black bg-white text-lg text-black hover:bg-gray-100"
										onClick={e => {
											e.preventDefault()
											handleAddItemToCart(id, title, product.featuredImage)
										}}
									>
										Add to Cart
									</Button>
								</div>
							</Link>
						</article>
					)
				})}
			</main>
			<div>
				<p>
					Showing {productVariants.length} of {getLocalWishlist().length} products
				</p>
				{hasNextPage && (
					<Button
						onClick={() => {
							setLoading(true)
							const params = new URLSearchParams(searchParams.toString())
							params.set('start', (limit + 2).toString())
							router.replace('/wishlist?' + params.toString(), { scroll: false })
						}}
					>
						{loading ? 'Loading...' : 'Load More'}
					</Button>
				)}
			</div>
		</div>
	)
}

export default Page
