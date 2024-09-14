import React from 'react'
import HeaderAction from '@/components/Header/HeaderAction/HeaderAction'
import { HeartStraight } from '@phosphor-icons/react/dist/ssr'
import Link from 'next/link'

const WishlistAction = () => {
    return (
        <Link href="/saved">
            <HeaderAction>
                <HeartStraight size={28} weight={'light'} />
            </HeaderAction>
        </Link>
    )
}

export default WishlistAction
