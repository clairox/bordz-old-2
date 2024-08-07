import { getInternalCustomer, updateInternalCustomer } from './customer'

export const mergeWishlists = (sourceWishlist: string[], targetWislist: string[]): string[] => {
	const mergedWishlist = new Array(...targetWislist)
	sourceWishlist.forEach(item => {
		if (!targetWislist.includes(item)) {
			mergedWishlist.push(item)
		}
	})

	return mergedWishlist
}

export const getLocalWishlist = (): string[] => JSON.parse(localStorage.getItem('wishlist') || '[]')

const setLocalWishlist = (wishlist: string[]) =>
	localStorage.setItem('wishlist', JSON.stringify(wishlist))

export const addWishlistItem = async (item: string): Promise<boolean> => {
	const updatedWishlist = getLocalWishlist().concat(item)

	try {
		const updatedCustomer = await updateInternalCustomer({
			wishlist: updatedWishlist,
		})

		if (updatedCustomer == undefined) {
			setLocalWishlist(updatedWishlist)
			return true
		}

		setLocalWishlist(updatedCustomer.wishlist)
		return true
	} catch (error) {
		return false
	}
}

export const removeWishlistItem = async (item: string) => {
	const updatedWishlist = getLocalWishlist().filter(wishlistItem => {
		return wishlistItem !== item
	})

	try {
		const updatedCustomer = await updateInternalCustomer({
			wishlist: updatedWishlist,
		})

		if (updatedCustomer == undefined) {
			setLocalWishlist(updatedWishlist)
			return true
		}

		setLocalWishlist(updatedCustomer.wishlist)
		return true
	} catch (error) {
		return false
	}
}

export const loadWishlist = async () => {
	const customer = await getInternalCustomer()
	if (customer == undefined) {
		const localWishlist = localStorage.getItem('wishlist')
		if (localWishlist == undefined) {
			setLocalWishlist([])
		}
		return
	}

	setLocalWishlist(customer?.wishlist)
}
