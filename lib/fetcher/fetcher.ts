export class FetcherError extends Error {
	public status: number
	public response: FetcherResponse

	constructor(message: string, status: number, response: FetcherResponse) {
		super(message)

		this.status = status
		this.response = response
	}
}

export class FetcherResponse {
	public headers: Headers
	public status: number
	public type: ResponseType
	public url: string
	public redirected: boolean
	public data: any

	constructor(response: Response, data: any) {
		const { headers, status, type, url, redirected } = response
		this.headers = headers
		this.status = status
		this.type = type
		this.url = url
		this.redirected = redirected
		this.data = data
	}
}

const fetcher = async (path: string, config?: RequestInit) => {
	const url = process.env.NEXT_PUBLIC_API_URL + path
	const headers = {
		'Content-Type': 'application/json',
		...config?.headers,
	}

	const response = await fetch(url, {
		...config,
		headers,
	})

	const data = await response.json()

	if (!response.ok) {
		const message = `Request failed with status code ${response.status}`
		const errorResponse = new FetcherResponse(response, data)

		throw new FetcherError(message, response.status, errorResponse)
	}

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

export { fetcher, gqlFetcher }
