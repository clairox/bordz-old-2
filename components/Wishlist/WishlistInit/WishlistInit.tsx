'use client'
import React, { useEffect } from 'react'
import { loadWishlist } from '@/lib/utils/wishlist'

const WishlistInit: React.FunctionComponent<React.PropsWithChildren> = ({ children }) => {
	useEffect(() => {
		loadWishlist()
	}, [])

	return <>{children}</>
}

export default WishlistInit
