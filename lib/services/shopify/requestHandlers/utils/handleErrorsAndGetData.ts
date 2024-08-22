import {
    GraphQLClientResponse,
    checkGraphQLErrors,
    checkUserErrors,
} from '@/lib/clients/graphqlClient'

const handleErrorsAndGetData = async <Q>(
    clientResponse: GraphQLClientResponse<Q>,
    dataKey: string,
    statusEvaluation?: Record<string, number>,
): Promise<Q> => {
    const { data, errors } = clientResponse

    checkGraphQLErrors(errors)

    if (data == undefined || typeof data !== 'object') {
        throw new Error('An error occurred while fetching shopify data')
    }

    const isValidKey = (obj: object, key: string | number | symbol): key is keyof object =>
        key in obj
    if (!isValidKey(data, dataKey)) {
        throw new Error(`Invalid key: ${dataKey}`)
    }

    const d = data[dataKey] as object
    if (d == undefined) {
        throw new Error('Resource not found')
    }
    const userErrorsKey = 'userErrors'
    const customerUserErrorsKey = 'customerUserErrors'

    if (isValidKey(d, userErrorsKey)) {
        checkUserErrors(d[userErrorsKey], statusEvaluation)
    } else if (isValidKey(d, customerUserErrorsKey)) {
        checkUserErrors(d[customerUserErrorsKey], statusEvaluation)
    }

    return data
}

export default handleErrorsAndGetData
