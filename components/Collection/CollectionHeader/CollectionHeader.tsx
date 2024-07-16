import _ from 'lodash'
import Link from 'next/link'
import { useParams, usePathname } from 'next/navigation'
import React from 'react'

const CollectionHeader: React.FunctionComponent<{
	title: string
	subcollectionTitles?: string[]
}> = ({ title, subcollectionTitles }) => {
	const pathname = usePathname()
	const params = useParams()
	const subcollectionParam = params.collection[1]

	return (
		<div className="border-b border-black">
			<div>
				<div className="border-b border-black text-3xl">
					<h1>{title}</h1>
				</div>
			</div>
			<div className="flex flex-row justify-between mx-auto w-[50%]">
				{subcollectionParam === undefined &&
					subcollectionTitles?.map(title => (
						<Link href={pathname + '/' + title} key={title}>
							<span>{_.startCase(title.replace('-', ' '))}</span>
						</Link>
					))}
			</div>
		</div>
	)
}

export default CollectionHeader
