import React from 'react'
import Link from 'next/link'
import _ from 'lodash'

const formatTitle = (string: string) => _.startCase(string.replace('-', ' '))

const CollectionHeader: React.FunctionComponent<{
	title: string
	subcollectionNames?: string[]
	basePath: string
}> = ({ title, subcollectionNames, basePath }) => {
	return (
		<div className="border-b border-black">
			<div>
				<div className="border-b border-black text-3xl">
					<h1>{title}</h1>
				</div>
			</div>
			<div className="flex flex-row justify-between mx-auto w-[50%]">
				{subcollectionNames !== undefined &&
					subcollectionNames.length > 0 &&
					subcollectionNames?.map(subcollectionName => (
						<Link href={basePath + '/' + subcollectionName} key={subcollectionName}>
							<span>{formatTitle(subcollectionName)}</span>
						</Link>
					))}
			</div>
		</div>
	)
}

export default CollectionHeader
