import { TypedDocumentNode } from '@graphql-typed-document-node/core'
import { GraphQLError, print } from 'graphql'
import { ShopifyUserError } from '@/types/store'
import { RestClientError, RestClientResponse } from './restClient'

type GraphQLClientConfig = {
    variables?: Record<string, any>
    cache?: RequestCache
}

type GraphQLClientResponse<Q> = {
    data: Q | null | undefined
    errors: GraphQLError[] | null | undefined
}

class GraphQLClientError extends Error {
    public status: number = 500
    public extensions: { [key: string]: unknown }

    constructor(error: GraphQLError) {
        super(error.message)

        this.extensions = error.extensions
        this.evaluateStatus()
    }

    evaluateStatus() {
        switch (this.message) {
            case 'Creating Customer Limit exceeded. Please try again later.':
                this.status = 429
                break
            default:
                this.status = 500
                break
        }
    }
}

class GraphQLUserError extends Error {
    public status: number = 500
    public code: string = 'USER_ERROR'

    constructor(message: string, statusEvaluation?: Record<string, any>) {
        super(message)

        this.evaluateStatus(statusEvaluation)
    }

    evaluateStatus(statusEvaluation?: Record<string, any>) {
        if (statusEvaluation == undefined) {
            this.status = 500
            return
        }

        const message = this.message

        const keys = Object.keys(statusEvaluation)
        if (keys.includes(message)) {
            this.status = statusEvaluation[message]
        } else {
            this.status = 500
        }
    }
}

class GraphQLUserErrorWithCode extends GraphQLUserError {
    constructor(message: string, code: string, statusEvaluation?: Record<string, any>) {
        super(message, statusEvaluation)

        this.code = code
        this.evaluateStatus(statusEvaluation)
    }

    evaluateStatus(statusEvaluation?: Record<string, any>) {
        if (statusEvaluation == undefined) {
            this.status = 500
            return
        }

        const code = this.code

        const keys = Object.keys(statusEvaluation)
        if (keys.includes(code)) {
            this.status = statusEvaluation[code]
        } else {
            this.status = 500
        }
    }
}

const checkGraphQLErrors = (errors: GraphQLError[] | null | undefined) => {
    if (errors) {
        throw new GraphQLClientError(errors[0])
    }
}

const checkUserErrors = (
    errors: ShopifyUserError[] | null | undefined,
    statusEvaluation?: Record<string, number>,
) => {
    console.error(errors)
    if (errors && errors.length > 0) {
        const { message, code } = errors[0]
        if (code) {
            throw new GraphQLUserErrorWithCode(message, code, statusEvaluation)
        } else {
            throw new GraphQLUserError(message, statusEvaluation)
        }
    }
}

const storefrontAPIClient = async <Q, V>(
    query: TypedDocumentNode<Q, V>,
    config?: GraphQLClientConfig,
): Promise<GraphQLClientResponse<Q>> => {
    const token = process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN
    if (token == undefined) {
        throw new Error('Missing Storefront API access token')
    }

    const url = process.env.SHOPIFY_STOREFRONT_BASE_URL
    if (url == undefined) {
        throw new Error('Missing Storefront API URL')
    }

    const fetchResponse = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'X-Shopify-Storefront-Access-Token': token },
        body: JSON.stringify({
            query: print(query),
            variables: config?.variables,
        }),
        cache: config?.cache,
    })

    const data = await fetchResponse.json()

    if (!fetchResponse.ok) {
        const message = `Request failed with status code ${fetchResponse.status}`
        const errorResponse = new RestClientResponse(fetchResponse, data)

        throw new RestClientError(message, errorResponse)
    }

    return data as GraphQLClientResponse<Q>
}

const adminAPIClient = async <Q, V>(
    query: TypedDocumentNode<Q, V>,
    config?: GraphQLClientConfig,
): Promise<GraphQLClientResponse<Q>> => {
    const token = process.env.SHOPIFY_ADMIN_API_ACCESS_TOKEN
    if (token == undefined) {
        throw new Error('Missing Admin API access token')
    }

    const url = process.env.SHOPIFY_ADMIN_BASE_URL
    if (url == undefined) {
        throw new Error('Missing Admin API URL')
    }

    const fetchResponse = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'X-Shopify-Access-Token': token },
        body: JSON.stringify({
            query: print(query),
            variables: config?.variables,
        }),
        cache: config?.cache,
    })

    const data = await fetchResponse.json()

    if (!fetchResponse.ok) {
        const message = `Request failed with status code ${fetchResponse.status}`
        const errorResponse = new RestClientResponse(fetchResponse, data)

        throw new RestClientError(message, errorResponse)
    }

    return data as GraphQLClientResponse<Q>
}

export type { GraphQLClientConfig, GraphQLClientResponse }
export {
    GraphQLClientError,
    GraphQLUserError,
    GraphQLUserErrorWithCode,
    checkGraphQLErrors,
    checkUserErrors,
    storefrontAPIClient,
    adminAPIClient,
}
