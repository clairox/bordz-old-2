import React from 'react'
import { HeartStraight } from '@phosphor-icons/react/dist/ssr'
import Link from 'next/link'
import NavAction from '@/components/NavAction'

const SavedNavAction = () => {
    return (
        <Link href="/saved">
            <NavAction>
                <HeartStraight size={28} weight={'light'} />
            </NavAction>
        </Link>
    )
}

export default SavedNavAction
