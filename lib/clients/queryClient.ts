import { QueryClient, defaultShouldDehydrateQuery, isServer } from '@tanstack/react-query'

const makeQueryClient = () => {
    return new QueryClient({
        defaultOptions: {
            queries: {
                staleTime: 60 * 1000,
            },
            dehydrate: {
                // include pending queries in dehydration
                shouldDehydrateQuery: query =>
                    defaultShouldDehydrateQuery(query) || query.state.status === 'pending',
            },
        },
    })
}

let browserQueryClient: QueryClient | undefined = undefined

export const getQueryClient = () => {
    if (isServer) {
        return makeQueryClient()
    } else {
        if (browserQueryClient == undefined) {
            browserQueryClient = makeQueryClient()
        }

        return browserQueryClient
    }
}
