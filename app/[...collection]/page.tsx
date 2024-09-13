import CollectionView from '@/components/Views/CollectionView'
import { getQueryClient } from '@/lib/clients/queryClient'
import { getCollectionQueryOptions } from '@/lib/utils/helpers'
import { FunctionComponent } from 'react'

type CollectionPageProps = {
    params: { collection: string[] }
    searchParams: Record<string, string>
}

const CollectionPage: FunctionComponent<CollectionPageProps> = ({ params, searchParams }) => {
    const queryClient = getQueryClient()
    void queryClient.prefetchQuery(
        getCollectionQueryOptions(params.collection[0], new URLSearchParams(searchParams)),
    )

    return <CollectionView handle={params.collection[0]} searchParams={searchParams} />
}

export default CollectionPage
