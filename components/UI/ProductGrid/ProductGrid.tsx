import Image, { ImageProps } from 'next/image'
import Link from 'next/link'
import { PropsWithChildren } from 'react'

function ProductGrid({ children }: PropsWithChildren) {
    return <div className="grid grid-cols-4">{children}</div>
}

function ProductGridItem({ children }: PropsWithChildren) {
    return <div className="flex flex-col border-r border-b border-black">{children}</div>
}

function ProductGridImage({ src, alt, width, height }: ImageProps) {
    return <Image src={src} alt={alt} width={width} height={height} />
}

function ProductGridDetails({ children }: PropsWithChildren) {
    return (
        <div className="flex flex-col gap-4 px-4 pt-4 pb-5 border-t border-gray leading-5">
            {children}
        </div>
    )
}

function ProductGridTitle({ children }: PropsWithChildren) {
    return <div className="line-clamp-2">{children}</div>
}

ProductGrid.Item = ProductGridItem
ProductGrid.Image = ProductGridImage
ProductGrid.Details = ProductGridDetails
ProductGrid.Title = ProductGridTitle

export { ProductGrid }
