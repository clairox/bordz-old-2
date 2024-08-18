import React from 'react'
import Link from 'next/link'
import _ from 'lodash'

const CollectionHeader: React.FunctionComponent<{
    title: string
    subcategoryTitles?: string[]
    pathname: string
}> = ({ title, subcategoryTitles, pathname }) => {
    return (
        <div className="border-b border-black">
            <div>
                <div className="border-b border-black text-3xl">
                    <h1>{title}</h1>
                </div>
            </div>
            <div className="flex flex-row justify-between mx-auto w-[50%]">
                {subcategoryTitles !== undefined &&
                    subcategoryTitles.length > 0 &&
                    subcategoryTitles?.map(title => (
                        <Link
                            href={pathname + '/' + _.toLower(title.replace(' ', '-'))}
                            key={title}
                        >
                            <span>{title}</span>
                        </Link>
                    ))}
            </div>
        </div>
    )
}

export default CollectionHeader
