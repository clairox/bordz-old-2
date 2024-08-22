import { adminAPIClient, type GraphQLClientConfig } from '@/lib/clients/graphqlClient'
import { TypedDocumentNode } from '@graphql-typed-document-node/core'
import handleErrorsAndGetData from '../utils/handleErrorsAndGetData'

const adminClient = async <Q, V>(
    query: TypedDocumentNode<Q, V>,
    dataKey: string,
    config?: GraphQLClientConfig,
    statusEvaluation?: Record<string, number>,
): Promise<Q> => {
    const response = await adminAPIClient(query, config)
    return handleErrorsAndGetData(response, dataKey, statusEvaluation)
}

export { adminClient }
