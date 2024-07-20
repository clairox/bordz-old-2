import React from 'react'
import HeaderAction from '@/components/Header/HeaderAction/HeaderAction'
import { HeartStraight } from '@phosphor-icons/react/dist/ssr'

const WishlistAction = () => {
	return (
		<HeaderAction>
			<HeartStraight size={28} weight={'light'} />
		</HeaderAction>
	)
}

export default WishlistAction
