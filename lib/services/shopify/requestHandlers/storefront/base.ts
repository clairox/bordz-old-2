import { storefrontAPIClient, type GraphQLClientConfig } from '@/lib/clients/graphqlClient'
import { TypedDocumentNode } from '@graphql-typed-document-node/core'
import handleErrorsAndGetData from '../utils/handleErrorsAndGetData'

const storefrontClient = async <Q, V>(
    query: TypedDocumentNode<Q, V>,
    dataKey: string,
    config?: GraphQLClientConfig,
    statusEvaluation?: Record<string, number>,
): Promise<Q> => {
    const response = await storefrontAPIClient(query, config)
    return handleErrorsAndGetData(response, dataKey, statusEvaluation)
}

export { storefrontClient }
