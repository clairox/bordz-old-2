import { PropsWithChildren } from 'react'
import Link, { LinkProps } from 'next/link'
import _ from 'lodash'
import { CaretRight } from '@phosphor-icons/react/dist/ssr'

const CollectionHeader = function ({ children }: PropsWithChildren) {
    return <div className="border-b border-black">{children}</div>
}

const CollectionHeaderLink = function ({ children, ...props }: PropsWithChildren<LinkProps>) {
    return (
        <Link {...props}>
            <div className="flex gap-1 items-center text-gray-600 hover:text-black">
                <CaretRight size={19} weight="fill" />
                {children}
            </div>
        </Link>
    )
}

CollectionHeader.Link = CollectionHeaderLink

export default CollectionHeader
