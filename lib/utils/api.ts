import { GraphQLError } from 'graphql'
import { NextResponse } from 'next/server'
import { FetcherError, GraphQLFetcherError, GraphQLUserError } from '../fetcher/fetcher'

export type UserError = { field?: string[] | null; message: string }

// TODO make this function private
export const DEFAULT_ERROR_RESPONSE = NextResponse.json(
	{
		message: 'Something went wrong on our end. Please try again later.',
		code: 'Internal Server Error',
	},
	{ status: 500 }
)

export class GenericAPIError extends Error {
	public code: string
	public status: number

	constructor(
		message: string = 'Something went wrong on our end. Please try again later.',
		code: string = 'Internal Server Error',
		status: number = 500
	) {
		super(message)

		this.code = code
		this.status = status
	}
}

export const handleErrorResponse = (error: Error) => {
	console.error(error)

	if (error instanceof FetcherError) {
		const { message, code, response } = error
		return NextResponse.json({ message, code }, { status: response.status })
	} else if (error instanceof GraphQLFetcherError) {
		const { message, extensions, status } = error
		const code = extensions ? extensions.code : 'GraphQL Error'
		return NextResponse.json({ message, code }, { status })
	} else if (error instanceof GraphQLUserError) {
		const { message, code, status } = error
		return NextResponse.json({ message, code }, { status })
	} else {
		return DEFAULT_ERROR_RESPONSE
	}
}

export const makeGQLError = (errors: GraphQLError[]) => {
	const { message, extensions } = errors[0]
	const code = extensions.code as string
	return new GenericAPIError(message, code, 400)
}
