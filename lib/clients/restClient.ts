class RestClientError extends Error {
    public response: RestClientResponse
    public code: string = 'Rest Client Error'

    constructor(message: string, response: RestClientResponse) {
        super(message)

        this.response = response
    }
}

class RestClientResponse {
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

const restClient = async (path: string, config?: RequestInit) => {
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
        const errorResponse = new RestClientResponse(response, data)

        throw new RestClientError(message, errorResponse)
    }

    if (response.status === 204) {
        return new RestClientResponse(response, null)
    }

    const data = await response.json()
    return new RestClientResponse(response, data)
}

export { restClient, RestClientError, RestClientResponse }
