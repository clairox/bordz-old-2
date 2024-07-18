import React from 'react'
import { ReadonlyURLSearchParams } from 'next/navigation'
import { AppRouterInstance } from 'next/dist/shared/lib/app-router-context.shared-runtime'
import _ from 'lodash'

const CollectionFooter: React.FunctionComponent<{
	renderedProductCount: number
	totalProductCount: number
	hasNextPage: boolean
	basePath: string
	router: AppRouterInstance
	searchParams: ReadonlyURLSearchParams
}> = ({ renderedProductCount, totalProductCount, hasNextPage, basePath, router, searchParams }) => {
	const startParam = _.toInteger(searchParams.get('start'))

	const handleLoadMore = () => {
		const params = new URLSearchParams(searchParams.toString())
		params.set('start', (startParam + 40).toString())
		router.replace(basePath + '?' + params.toString(), { scroll: false })
	}
	return (
		<div>
			<p>
				Showing {renderedProductCount} of {totalProductCount} products
			</p>
			{hasNextPage && <button onClick={handleLoadMore}>Load More</button>}
		</div>
	)
}

export default CollectionFooter
