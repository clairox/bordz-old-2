import type { CollectionName } from '@/types'
import React from 'react'
import CollectionPage from '@/components/CollectionPage'

const Page: React.FunctionComponent<{
	params: { collection: CollectionName }
	searchParams: { start?: number; brand?: string; size?: string; color?: string }
}> = async ({ params, searchParams }) => {
	return <CollectionPage params={params} searchParams={searchParams} />
}

export default Page
