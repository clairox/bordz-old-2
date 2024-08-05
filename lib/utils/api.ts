import { GraphQLError } from 'graphql'
import { NextResponse } from 'next/server'

export type UserError = { field?: string[] | null; message: string }

export const defaultErrorResponse = NextResponse.json(
	{ message: 'Internal Server Error', code: 'INTERNAL_SERVER_ERROR' },
	{ status: 500 }
)

export class APIError extends Error {
	public code: string
	public status: number

	constructor(
		message: string = 'Internal Server Error',
		code: string = 'INTERNAL_SERVER_ERROR',
		status: number = 500
	) {
		super(message)

		this.code = code
		this.status = status
	}
}

export const makeGQLError = (errors: GraphQLError[]) => {
	const { message, extensions } = errors[0]
	const code = extensions.code as string
	return new APIError(message, code, 400)
}
