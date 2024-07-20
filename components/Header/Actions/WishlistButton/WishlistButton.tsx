import React from 'react'
import { HeartStraight } from '@phosphor-icons/react/dist/ssr'

const WishlistButton = () => {
	return (
		<div className="flex justify-center items-center w-16 h-full border-l border-b border-black cursor-pointer">
			<button className="flex justify-center items-center w-ful">
				<HeartStraight size={28} weight="light" />
			</button>
		</div>
	)
}

export default WishlistButton
