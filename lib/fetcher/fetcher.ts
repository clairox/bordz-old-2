import { TypedDocumentNode } from '@graphql-typed-document-node/core'
import { GraphQLError, GraphQLFormattedError, print } from 'graphql'
import { GenericAPIError } from '../utils/api'
import { string } from 'zod'
import { Code } from 'lucide-react'
import { ShopifyUserError } from '@/types/store'

export class FetcherError extends Error {
	public status: number // TODO: remove status property. We will get status from response
	public response: FetcherResponse
	public code: string = 'Fetcher Error'

	constructor(message: string, status: number, response: FetcherResponse) {
		super(message)

		this.status = status
		this.response = response
	}
}

export class FetcherResponse {
	public ok: boolean
	public headers: Headers
	public status: number
	public type: ResponseType
	public url: string
	public redirected: boolean
	public data: any

	constructor(response: Response, data: any) {
		const { ok, headers, status, type, url, redirected } = response
		this.ok = ok
		this.headers = headers
		this.status = status
		this.type = type
		this.url = url
		this.redirected = redirected
		this.data = data
	}
}

const fetcher = async (path: string, config?: RequestInit) => {
	const url = path.startsWith('/') ? process.env.NEXT_PUBLIC_API_URL + path : path
	const headers = {
		'Content-Type': 'application/json',
		...config?.headers,
	}

	const response = await fetch(url, {
		...config,
		headers,
	})

	if (!response.ok) {
		const message = `Request failed with status code ${response.status}`
		const data = await response.json()
		const errorResponse = new FetcherResponse(response, data)

		throw new FetcherError(message, response.status, errorResponse)
	}

	if (response.status === 204) {
		return new FetcherResponse(response, null)
	}

	const data = await response.json()
	return new FetcherResponse(response, data)
}

type GQLFetcherConfig = {
	api: 'storefront' | 'admin'
	query: string
	variables?: Record<string, any>
	fetchPolicy?: string
	token: string
}

const gqlFetcher = async (config: GQLFetcherConfig) => {
	const { api, query, variables, fetchPolicy, token } = config

	let url = ''
	const headers: HeadersInit = { 'Content-Type': 'application/json' }

	switch (api) {
		case 'storefront':
			url = 'https://quickstart-75684a38.myshopify.com/api/2024-04/graphql.json'
			headers['X-Shopify-Storefront-Access-Token'] = token
			break
		case 'admin':
			url = 'https://quickstart-75684a38.myshopify.com/admin/api/2024-04/graphql.json'
			headers['X-Shopify-Access-Token'] = token
			break
		default:
			throw new Error("Invalid value on parameter 'api'")
	}

	const fetchConfig = {
		method: 'POST',
		headers,
		body: JSON.stringify({
			query,
			variables,
			fetchPolicy,
		}),
	}
	const response = await fetch(url, fetchConfig)

	const data = await response.json()

	if (!response.ok) {
		const message = `Request failed with status code ${response.status}`
		const errorResponse = new FetcherResponse(response, data)

		throw new FetcherError(message, response.status, errorResponse)
	}

	return data
}

type GQLSpecificFetcherConfig = Omit<GQLFetcherConfig, 'api' | 'token'>
const gqlStorefrontFetcher = async (config: GQLSpecificFetcherConfig) => {
	const storefrontAccessToken = process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN
	if (storefrontAccessToken == undefined) {
		throw new Error('Missing access token')
	}

	return gqlFetcher({
		...config,
		api: 'storefront',
		token: storefrontAccessToken,
	})
}

type GraphQLFetcherConfig = {
	variables?: Record<string, any>
	cache?: RequestCache
}

type GraphQLFetcherResponse<Q> = {
	data: Q | null | undefined
	errors: GraphQLError[] | null | undefined
}

export class GraphQLFetcherError extends Error {
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

export class GraphQLUserError extends Error {
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

export class GraphQLUserErrorWithCode extends GraphQLUserError {
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

export const checkGraphQLErrors = (errors: GraphQLError[] | null | undefined) => {
	if (errors) {
		throw new GraphQLFetcherError(errors[0])
	}
}

export const checkUserErrors = (
	errors: ShopifyUserError[] | null | undefined,
	statusEvaluation?: Record<string, number>
) => {
	if (errors && errors.length > 0) {
		const { message, code } = errors[0]
		if (code) {
			throw new GraphQLUserErrorWithCode(message, code, statusEvaluation)
		} else {
			throw new GraphQLUserError(message, statusEvaluation)
		}
	}
}

// TODO: const shopifyGraphQLAPIFetcher = () => {}

export const storefrontAPIFetcher = async <Q, V>(
	query: TypedDocumentNode<Q, V>,
	config?: GraphQLFetcherConfig
): Promise<GraphQLFetcherResponse<Q>> => {
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
		const errorResponse = new FetcherResponse(fetchResponse, data)

		throw new FetcherError(message, fetchResponse.status, errorResponse)
	}

	return data as GraphQLFetcherResponse<Q>
}

export const adminAPIFetcher = async <Q, V>(
	query: TypedDocumentNode<Q, V>,
	config?: GraphQLFetcherConfig
): Promise<GraphQLFetcherResponse<Q>> => {
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
		const errorResponse = new FetcherResponse(fetchResponse, data)

		throw new FetcherError(message, fetchResponse.status, errorResponse)
	}

	return data as GraphQLFetcherResponse<Q>
}

export { fetcher, gqlFetcher, gqlStorefrontFetcher }
