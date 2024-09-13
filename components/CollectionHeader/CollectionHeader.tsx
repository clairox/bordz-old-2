import { PropsWithChildren } from 'react'
import Link, { LinkProps } from 'next/link'
import _ from 'lodash'
import { CaretRight } from '@phosphor-icons/react/dist/ssr'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../UI/Select'
import { useSearchParams } from 'next/navigation'
import { useRefineCollectionSearchParams } from '@/hooks'

const CollectionHeader = function ({ children }: PropsWithChildren) {
    return <div className="border-b border-black">{children}</div>
}

const CollectionHeaderSelect = function () {
    const searchParams = useSearchParams()
    const refineSearchParams = useRefineCollectionSearchParams()

    const defaultValue = searchParams.get('sortBy') || 'newest'

    const handleSelect = (value: string) => {
        const newSearchParams = new URLSearchParams(searchParams)
        newSearchParams.set('sortBy', value)

        refineSearchParams(newSearchParams)
    }

    return (
        <Select defaultValue={defaultValue} onValueChange={handleSelect}>
            <SelectTrigger className="w-48">
                <SelectValue />
            </SelectTrigger>
            <SelectContent>
                <SelectItem value="newest">Newest</SelectItem>
                <SelectItem value="recommended">Best Selling</SelectItem>
                <SelectItem value="priceHighToLow">Price (High - Low)</SelectItem>
                <SelectItem value="priceLowToHigh">Price (Low - High)</SelectItem>
            </SelectContent>
        </Select>
    )
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

CollectionHeader.Select = CollectionHeaderSelect
CollectionHeader.Link = CollectionHeaderLink

export default CollectionHeader
